var userId = null;
AFRAME.registerComponent("marker-handler",{
    init:function(){
        this.el.addEventListener("markerFound",(e)=>{
            var markerId = this.el.id;
            var toys = this.getToys()
            var toy = toys.filter(toy=>{toy.id===markerId})[0]
            if(toy.is_out_of_stock===false){
               this.HandleMarkerFound(toy);
            }else{
                swal({
                    icon:"warning",
                    text:"sorry this toy is out of stock",
                    timer:2500,
                    buttons:false
                })
            }
        })
        this.el.addEventListener("markerLost",(e)=>{
            this.HandleMarkerLost();
        })
    },
    HandleMarkerFound:function(toy){
        var modelContainer = document.querySelector(`model-${toy.id}`)
        modelContainer.setAttribute("visible",true);

        var ingrediantsContainer=document.querySelector(`#main-plane-${toy.id}`);
        ingrediantsContainer.setAttribute("visible",true);
  
        var pricePlane = document.querySelector(`#price-plane-${toy.id}`);
        pricePlane.setAttribute("visible",true);
        
        var button = document.getElementById("button-div");
        button.style.display="flex"

        var ratingButton = document.getElementById("rating-button");
        var orderButton = document.getElementById("order-button");
        var orderSummaryButton = document.getElementById("order-summary-button");

        // Handling Click Events 
        ratingButton.addEventListener("click", function () { 
            swal({ icon: "warning", title: "Rate Dish", text: "Work In Progress" }); 
        }); 

        orderSummaryButton.addEventListener("click",function(){
            this.handleOrderSummary()
        })

        orderButton.addEventListener("click", () => { 
            if(userId===null){
                userId = this.askUserId()
            }
            else{
                var userNumber;
                userId<=9?userNumber=`U0${userId}`:userNumber=`U${userId}`;
                this.handleOrder(userNumber,toy);
            }
            
        });
    },
    HandleOrder:function(userNumber,toy){
      firebase
      .firestore()
      .collection("users")
      .doc(userNumber)
      .get()
      .then(doc=>{
        var details = doc.data();
        if(details["current_orders"][toy.id]){
            details["current_orders"][toy.id]["quantity"]+=1;

            var currentQuantity = details["current_orders"][toy.id]["quantity"];
            details["current_orders"][dish.id]["subtotal"]=currentQuantity*toy.price;
        }else{
            details["current_orders"][dish.id]={
                item:toy.toy_name,
                price:toy.price,
                quantity:1,
                subtotal:toy.price*1
            }
        }
        details.total_bill+=toy.price;

        firebase
        .firestore()
        .collection("users")
        .doc(doc.id)
        .update(details)
      })

    },
    handleOrderSummary:async function(){
        var userNumber;
        userId<=9?userNumber=`U0${userId}`:userNumber=`U${userId}`;
    
        var orderSummary = await this.getOrderSummary(tNumber);
        //changing modal division visiblity
        var modalDiv = document.getElementById("modal-div");
        modalDiv.style.display="flex";
    
        var tableBodyTag=document.getElementById("bill-table-body");
    
        // removing old tr data
        tableBodyTag.innerHTML="";
    
        // get current orders key
        var currentOrders = Object.keys(orderSummary.current_orders);
        currentOrders.map(i=>{
          //Create table row 
          var tr = document.createElement("tr");
          
          //Create table cells/columns for ITEM NAME, PRICE, QUANTITY & TOTAL PRICE 
          var item = document.createElement("td"); 
          var price = document.createElement("td"); 
          var quantity = document.createElement("td"); 
          var subtotal = document.createElement("td"); 
          
          //Add HTML content 
          item.innerHTML = orderSummary.current_orders[i].item; 
          price.innerHTML = "$" + orderSummary.current_orders[i].price; 
          price.setAttribute("class", "text-center"); 
          quantity.innerHTML = orderSummary.current_orders[i].quantity; 
          quantity.setAttribute("class", "text-center"); 
          subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal; 
          subtotal.setAttribute("class", "text-center"); 
          
          //Append cells to the row 
          tr.appendChild(item); 
          tr.appendChild(price); 
          tr.appendChild(quantity); 
          tr.appendChild(subtotal); 
          
          //Append row to the table 
          tableBodyTag.appendChild(tr);
        })

    },
    HandleMarkerLost:function(){
        var button = document.getElementById("button-div");
        button.style.display="none"
    },
    askUserId:function(){
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
        swal({
            icon:iconUrl,
            title:"Welcome To TOYMANIA",
            content:{
                element:"input",
                attributes:{placeholder:"type your user id ",type:"number",min:1}
            },
            closeOnClickOutside:false
        }).then(inputValue=>{
            userId=inputValue;
        })
      },
    getToys:async function(){
        return await firebase
                     .firestore()
                     .collection("toys")
                     .get()
                     .then(snap=>{
                        return snap.docs.map(doc=>doc.data())
                     })
    }
})