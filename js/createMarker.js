AFRAME.registerComponent("create-marker",{
    init:async function(){
     var mainscene = document.querySelector("#scene");
     toys = await this.getToys();
     toys.map(toy=>{
        var marker = document.createElement("a-marker");
        marker.setAttribute("id",toy.id);
        marker.setAttribute("type","pattern");
        marker.setAttribute("url",toy.marker_pattern_url);
        marker.setAttribute("cursor",{rayOrigin:"mouse"});
        marker.setAttribute("marker-handler",{});

        mainscene.appendChild(marker);

        var model = document.createElement("a-entity");
        model.setAttribute("position",toy.model_geometry.position);
        model.setAttribute("scale",toy.model_geometry.scale);
        model.setAttribute("rotation",toy.model_geometry.rotation);
        model.setAttribute("id",`model-${toy.id}`);
        model.setAttribute("gltf-model",toy.model_url);
        model.setAttribute("visible",false);

        marker.appendChild(model);

        var mainPlane = document.createElement("a-plane"); 
        mainPlane.setAttribute("id", `main-plane-${toy.id}`); 
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 }); 
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 }); 
        mainPlane.setAttribute("width", 1.7); 
        mainPlane.setAttribute("height", 1.5); 
        mainPlane.setAttribute("visible",false);

        marker.appendChild(mainPlane);

        // toy title background plane 
        var titlePlane = document.createElement("a-plane"); 
        titlePlane.setAttribute("id", `title-plane-${toy.id}`); 
        titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 }); 
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 }); 
        titlePlane.setAttribute("width", 1.69); 
        titlePlane.setAttribute("height", 0.3); 
        titlePlane.setAttribute("material", { color: "#F0C30F" }); 
        
        mainPlane.appendChild(titlePlane);

        // toy title 
        var toyTitle = document.createElement("a-entity"); 
        toyTitle.setAttribute("id", `toy-title-${toy.id}`); 
        toyTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 }); 
        toyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 }); 
        toyTitle.setAttribute("text", { font: "monoid", color: "black", width: 1.8, height: 1, align: "center", value: toy.toy_name.toUpperCase() }); 

        titlePlane.appendChild(toyTitle);

         // Ingredients List 
         var discription = document.createElement("a-entity"); 
         discription.setAttribute("id", `discription-${toy.id}`); 
         discription.setAttribute("position", { x: 0.3, y: 0, z: 0.1 }); 
         discription.setAttribute("rotation", { x: 0, y: 0, z: 0 }); 
         discription.setAttribute("text", { font: "monoid", color: "black", width: 2, align: "left", value: `${toy.discription}\n${toy.age_group}` }); 
         
         mainPlane.appendChild(discription);  

        var pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id",`price-plane-${toy.id}`);
        pricePlane.setAttribute("src","https://raw.githubusercontent.com/whitehatjr/ar-toy-store-assets/master/black-circle.png");
        pricePlane.setAttribute("width",0.8);
        pricePlane.setAttribute("height",0.8);
        pricePlane.setAttribute("position",{x:-1.3,y:0,z:0.3});
        pricePlane.setAttribute("rotation",{x:-90,y:0,z:0});
        pricePlane.setAttribute("visible",false);

        var price = document.createElement("a-entity");
        price.setAttribute("id",`price-${toy.id}`);
        price.setAttribute("position",{x:0.03,y:0.05,z:0.1});
        price.setAttribute("rotation",{x:0,y:0,z:0});
        price.setAttribute("text",{ font: "mozillavr", color: "white", width: 3, align: "center", value: `Only\n Rs${toy.price}` });

        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);
     })

    },
    getToys:async function(){
        return await 
               firebase
               .firestore()
               .collection("toys")
               .get()
               .then(snapshot=>{
                return snapshot.docs.map(doc=>doc.data())
               })
    }
})