            
        angular.module('mapApp', [])
            .factory('mapFact', [function(){
                map = L.map('mapid').setView([67.5, 64.06], 13);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoid3Rjb2RlYWkiLCJhIjoiY2pzdW1hcnNnMXo0ZjN5b2U4bTl6MmRoNCJ9.x-QLTCtMKIHS5EyvAMOBFg', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1Ijoid3Rjb2RlYWkiLCJhIjoiY2pzdW1hcnNnMXo0ZjN5b2U4bTl6MmRoNCJ9.x-QLTCtMKIHS5EyvAMOBFg'
                }).addTo(map);
                data = [{
                name: "Природа",
                places: [{
                    name: "Водные объекты",
                    places: [{
                        name: "Маленькое озеро",
                        id: 1,
                        latlon: [67.49504, 64.03913]
                    }, {
                        name: "Соленое озеро",
                        id: 2,
                        latlon: [67.48478, 64.03124]
                    }, {
                        name: "Река",
                        id: 3,
                        latlon: [67.50535, 64.03210]
                    }
                    ]
                }, {
                    name: "Ландшафт",
                    places: [{
                        name: "Большой парк",
                        id: 4,
                        latlon: [67.49412, 64.04016]
                    }, {
                        name: "Маленький парк",
                        id: 5,
                        latlon: [67.49931, 64.05888]
                    }, {
                        name: "Равнина",
                        id: 6,
                        latlon: [67.49162, 64.09853]
                    }
                    ]
                }
                ]
                }, {
                    name: "Постройки",
                    places: [{
                        name: "Дома",
                        places: [{
                            name: "Дом на Парковой",
                            id: 7,
                            latlon: [67.49832, 64.05355]
                        }, {
                            name: "Дом на ТЭЦ",
                            id: 8,
                            latlon: [67.49642, 64.01939]
                        }, {
                            name: "Дом на Чернова",
                            id: 9,
                            latlon: [67.50804, 64.05802]
                        }
                        ]
                    }, {
                        name: "Культурные объекты",
                        places: [{
                            name: "Памятник Ленину",
                            id: 10,
                            latlon: [67.48978, 64.06574]
                        }, {
                            name: "Памятник Сталину",
                            id: 11,
                            latlon: [67.50949, 64.04068]
                        }, {
                            name: "Памятник Марксу",
                            id: 12,
                            latlon: [67.51303, 64.06106]
                        }
                        ]
                    }
                    ]
                }];
                let array = [];

                simplify = data => {               
                    for (let item of data){
                        if(item.hasOwnProperty('places')){
                            simplify(item.places);
                        }
                        else {
                            array.push(item);
                        }
                    }
                    return array;
                };

                datasimpled = simplify(data);

                return {
                    apimap: map,
                    mapdata: data,
                    simpleddata: datasimpled
                };

            }])
            .controller('mainCtrl', ['$scope', 'mapFact', function($scope, mapFact) {

                let testmap = mapFact.apimap;
                    a = $scope;
                a.mapdata = mapFact.mapdata;
                a.mapdatasimpled = mapFact.simpleddata;
                a.mapdataremoved = [];

                a.addMarker = mark => {
                    if (mark.onmap =='idle' || mark.hasOwnProperty('onmap')==false){
                        mark.onmap = 'added';
                        L.marker(mark.latlon, {
                            title: mark.name,
                            id: mark.id
                        }).addTo(testmap).on('mouseover', a.removeMarker); 
                    }
                }

                a.addMarkers = data =>{
                    for (let mark of data) {
                        if(mark.hasOwnProperty('places')) {
                            a.addMarkers(mark.places);
                        }
                        else{
                            a.addMarker(mark);
                        }
                    }
                };

                a.removeMarker = function(e){
                    mark = a.mapdatasimpled.find(mark => mark.id == e.target.options.id)
                    testmap.removeLayer(this);
                    mark.onmap = 'removed';
                    reArray();
                    a.$apply();
                }

                a.returnMarker = mark => {
                    mark.onmap = 'idle';
                    reArray();
                }   
                
                reArray = () => { 
                    a.mapdataremoved = a.mapdatasimpled.filter(mark => mark.onmap == 'removed'); 
                }
                

        }]);