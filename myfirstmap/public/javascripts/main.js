var mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 10,
};

var map = new naver.maps.Map("map", mapOptions);

var markerList = [];
var infowindowList = [];

//데이터 반복문
for (var i in data) {
    var target = data[i];
    var latlng = new naver.maps.LatLng(target.lat, target.lng);

    // 마커
    var marker = new naver.maps.Marker({
        map: map,
        position: latlng,
        icon: {
            content: "<div class='marker'></div>",
            anchor: new naver.maps.Point(12, 12),
        },
    });

    //정보창
    var content = `<div class='infowindow_wrap'>
        <div class='infowindow_title'>${target.title}</div>
        <div class='infowindow_content'>${target.content}</div>
        <div class='infowindow_data'>${target.date}</div>
      </div>`;

    var infowindow = new naver.maps.InfoWindow({
        content: content,
        backgroundColor: "#00ff0000",
        borderColor: "#00ff0000",
        anchorSize: new naver.maps.Size(0, 0),
    });

    markerList.push(marker);
    infowindowList.push(infowindow);
}

for (var i = 0, ii = markerList.length; i < ii; i++) {
    naver.maps.Event.addListener(map, "click", ClickMap(i));
    naver.maps.Event.addListener(
        markerList[i],
        "click",
        getClickHandler(i)
    );
}

function ClickMap(seq) {
    return () => {
        var infowindow = infowindowList[seq];
        infowindow.close();
    };
}

function getClickHandler(seq) {
    return function () {
        var marker = markerList[seq];
        var infowindow = infowindowList[seq];
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            infowindow.open(map, marker);
        }
    };
}

let currentUse = true;

$("#current").click(() => {
    console.log(navigator);
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const location = new naver.maps.LatLng(lat, lng);

            if (currentUse) {
                marker = new naver.maps.Marker({
                    map: map,
                    position: location,
                    icon: {
                        content:
                            '<img class="pulse" draggable="false" unselectable="on" src="/images/location.png">',
                        anchor: new naver.maps.Point(11, 11),
                    },
                });
                currentUse = false;
            }

            map.setZoom(18, false); // 지도의 줌 레벨을 변경합니다.
            map.panTo(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
        });
    } else {
        alert("위치정보 사용 불가");
    }
});

let ps = new kakao.maps.services.Places();
let search_arr = [];

$("#search_input").on("keydown", function (e) {
    if (e.keyCode == 13) {
        let content = $(this).val();
        ps.keywordSearch(content, placeSearchCB);
    }
});
$("#search_button").on("click", function (e) {
    let content = $("search_input").val();
    ps.keywordSearch(content, placeSearchCB);
});
function placeSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        let target = data[0];
        const lat = target.y;
        const lng = target.x;

        const latlng = new naver.maps.LatLng(lat, lng);

        marker = new naver.maps.Marker({
            position: latlng,
            map: map,
        });
        if (search_arr.length == 0) {
            search_arr.push(marker);
        } else {
            search_arr.push(marker);
            let pre_marker = search_arr.slice(0, 1);
            pre_marker[0].setMap(null);
        }
        map.setZoom(16, false);
        map.panTo(latlng);
        console.log(target);
    } else {
        alert("검색결과가 없습니다");
    }
}