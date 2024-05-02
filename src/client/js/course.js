const locationMap = document.getElementById("location-map");

let map;
let userLatitude;
let userLongitude;
let isMapDrawn = false;
let courseData = [];
let markers = [];
let clickCourse;

const panTo = (latitude, longitude) => {
  const position = new kakao.maps.LatLng(latitude, longitude);
  map.panTo(position);
};

const clickCourseList = (e, courseNo) => {
  if (clickCourse !== courseNo) {
    // li 로 작성된 class course불러오기
    const courseWrap = document.querySelectorAll(".course");
    for (let i = 0; i < courseWrap.length; i++) {
      courseWrap[i].classList.remove("on");
    }
    // 클릭된 버튼 색 설정하기
    e.currentTarget.classList.add("on");
    let courseLatitude;
    let courseLongitude;

    if (courseNo === 0) {
      courseLatitude = userLatitude;
      courseLongitude = userLongitude;
    } else {
      let matchCourse = courseData.find((c) => c.course_no === courseNo);
      courseLatitude = matchCourse.course_latitude;
      courseLongitude = matchCourse.course_longitude;
    }

    panTo(courseLatitude, courseLongitude);
    clickCourse = courseNo;
  }
};

// 마커를 그리는 함수
const addMarker = (position) => {
  let marker = new kakao.maps.Marker({
    position: position,
  });
  marker.setMap(map);
  markers.push(marker);
};
// 마커 지우는 함수
const delMarker = () => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
};

const addCourseMarker = (course) => {
  let markerImageUrl = "/file/map_not_done.png";
  let markerImageSize = new kakao.maps.Size(24, 35);
  // 미방문시 마커
  const kakaoMakerImage = new kakao.maps.MarkerImage(
    markerImageUrl,
    markerImageSize
  );
  const latlng = new kakao.maps.LatLng(
    course.course_latitude,
    course.course_longitude
  );
  new kakao.maps.Marker({
    map: map,
    position: latlng,
    title: course.course_name,
    image: kakaoMakerImage,
  });
  // 방문시 마커
};

const setCourseMarker = () => {
  for (let i = 0; i < courseData.length; i++) {
    addCourseMarker(courseData[i]);
  }
};

const drawMap = (latitude, longitude) => {
  // 1번째 인자: 지도 그림 DOM (HTML) . 지도 그리기
  map = new kakao.maps.Map(locationMap, {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 3,
  });
  map.setZoomable(false);
};

const configLocation = () => {
  if (navigator.geolocation) {
    // web api
    navigator.geolocation.watchPosition((pos) => {
      userLatitude = pos.coords.latitude;
      userLongitude = pos.coords.longitude;
      // delMarker();

      if (!isMapDrawn) {
        // 지도그리기
        drawMap(userLatitude, userLongitude);
        // 2.마커 그리기
        setCourseMarker();

        // 변수값 변경
        isMapDrawn = true;
      }
      addMarker(new kakao.maps.LatLng(userLatitude, userLongitude));
      if (clickCourse === 0) {
        panTo(userLatitude, userLongitude);
      }
    });
  }
};

const makeCourseNaviHTML = (data) => {
  const courseWrap = document.getElementById("courseWrap");
  let html = "";

  data.forEach(
    (data) =>
      (html += `<li class ="course" onclick="clickCourseList(event, ${data.course_no})"> <p>${data.course_name}</p></li>`)
  );
  // for (let i = 0; i < data.length; i++) {
  //   console.log(data[i])
  //   html += `<li class="course" onclick="clickCourseList(event, ${data[i].course_no})>`;
  //   html += `<p>${data[i].course_name}</p>`;
  //   html += `</li>`;
  // }
  html += `<li id="myPosition" class="course on" onclick="clickCourseList(event, 0)">나의 위치</li>`;
  courseWrap.innerHTML = html;
};

// 코스데이터 불러오는 fetch함수
const getCourseList = async () => {
  const response = await fetch("/api/course");
  const result = await response.json();
  const data = result.data;
  courseData = data;
  console.log(data);
  makeCourseNaviHTML(data);
  configLocation();
};
getCourseList();
