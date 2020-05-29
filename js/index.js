var map;
var infoWindow;
let markers=[];
/*This Function Initializes The Map*/
function initMap(){
/*This BAsically Puts The Map Put There Onto The HTML Page*/
    var LosAngeles={
    lat:34.063380,
    lng:-118.358080
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center:LosAngeles,
        zoom:8,
        mapTypeId: 'roadmap',
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#d59563'}]
                        },
                        {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#d59563'}]
                        },
                        {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{color: '#263c3f'}]
                        },
                        {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#6b9a76'}]
                        },
                        {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{color: '#38414e'}]
                        },
                        {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{color: '#212a37'}]
                        },
                        {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#9ca5b3'}]
                        },
                        {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{color: '#746855'}]
                        },
                        {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{color: '#1f2835'}]
                        },
                        {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#f3d19c'}]
                        },
                        {
                        featureType: 'transit',
                        elementType: 'geometry',
                        stylers: [{color: '#2f3948'}]
                        },
                        {
                        featureType: 'transit.station',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#d59563'}]
                        },
                        {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{color: '#17263c'}]
                        },
                        {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#515c6d'}]
                        },
                        {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{color: '#17263c'}]
                        }
                    ]
                });
                infoWindow=new google.maps.InfoWindow();    
                searchStores();
                //showStoresMarkers();
                setOnClickListener();  
            }

function displayStores(stores){
    var storeshtml='';
    let i=0;
    stores.forEach(function(store,index){
        let address=store['addressLines'];
        var phone=store['phoneNumber'];
        //console.log(store);
        storeshtml+=`
        <div class="store-container">
        <div class="transition-background">
            <div class="store-info-container">
                <div class="store-address">
                    <span >${address[0]}</span>
                    <span>${address[1]}</span>
                </div>
                <div class="store-phone-number">${phone}</div>
            </div>
            <div class="store-number-container">
                <div class="store-number">
                        ${index+1}
                </div>
            </div>
        </div>
    </div>`
    });
    document.querySelector('.stores-list').innerHTML=storeshtml;
}

/*The First Thing To Do When Reading From The Data
function displayStores(){
    var storeshtml='';
    let i=0;
    stores.forEach(function(store){
        console.log(store);
    })
}
 */

 function showStoresMarkers(stores){
    let bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store,index){
        let latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        
        //console.log(latlng)
        var name=store.name;
        var address=store.addressLines[0];
        bounds.extend(latlng);
        var timin=store.openStatusText;
        var phone=store.phoneNumber;
        createMarker(latlng,name,address,timin,phone,index);
    })
    map.fitBounds(bounds);
 }


function createMarker(latlng, name, address,timin,phonenumber,index) {
    
    var html =`
    <div class="transition-container">
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${timin}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-route"></i>
                </div>
                <a href="https://www.google.com/maps/dir/?api=1&origin=452+Kintyre+ON&destination=${latlng}&travelmode=bus">
                ${address}</a>
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fab fa-phoenix-framework"></i>
                </div>
                ${phonenumber}
            </div>
        </div>
    </div>
   `
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}

function setOnClickListener(){
    var storeElements=document.querySelectorAll('.store-container');
    
    storeElements.forEach(function(elem,index){
        elem.addEventListener('click',function(){
            new google.maps.event.trigger(markers[index], 'click');
    })
})
}

function searchStores(){
    var foundStores=[];
    var zipCode=document.getElementById('zip-code-input').value;
    if(zipCode){
            stores.forEach(function(store){
            var postal=store.address.postalCode.substring(0,5);
            if(postal==zipCode){
                foundStores.push(store);
            }
        });
    }else{
        foundStores=stores;
    }
    displayStores(foundStores);
    clearLocations();
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}