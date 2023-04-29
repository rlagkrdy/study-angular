import { Injectable } from "@angular/core";

declare const kakao;

@Injectable({
  providedIn: "root",
})
export class NgMapService {
  private geocoder;

  constructor() {}

  private initMap(elementId: string, options: any): any {
    return new kakao.maps.Map(document.getElementById(elementId), options);
  }

  setMapDraggable(map: any, draggable: boolean) {
    // 마우스 드래그로 지도 이동 가능여부를 설정합니다
    map.setDraggable(draggable);
  }

  setZoomable(map: any, zoomable: boolean) {
    // 마우스 휠로 지도 확대,축소 가능여부를 설정합니다
    map.setZoomable(zoomable);
  }

  userAddressSetMap(elementId: string, address: string): void {
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address, (result, status) => {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const map = this.initMap(elementId, {
          center: new kakao.maps.LatLng(result[0].y, result[0].x), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        });

        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        const marker = new kakao.maps.Marker({
          position: coords,
          image: this.getMarkImage(),
        });
        marker.setMap(map);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
        this.setMapDraggable(map, false);
        this.setZoomable(map, false);
      }
    });
  }

  setMapWithLatLng(
    elementId: string,
    lat: string,
    lng: string,
    isID: boolean
  ): any {
    const map = this.initMap(elementId, {
      center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
      level: 4, // 지도의 확대 레벨
    });

    const coords = new kakao.maps.LatLng(lat, lng);

    // 결과값으로 받은 위치를 마커로 표시합니다
    const marker = new kakao.maps.Marker({
      position: coords,
      image: this.getMarkImage(),
    });
    marker.setMap(map);

    if (isID) {
      this.setInfoWindow(map, coords);
    }

    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
    map.setCenter(coords);
    this.setMapDraggable(map, false);
    this.setZoomable(map, false);
    return map;
  }

  setInfoWindow(map: any, coords: any): any {
    const content = `<div class="info-window-box"><p class="info-window-text"><span class="mint">2km</span>이내</p></div>`;

    var customOverlay = new kakao.maps.CustomOverlay({
      position: coords,
      content: content,
      yAnchor: 1.5,
    });

    return customOverlay.setMap(map);
  }

  getAddressLatLng(address): Promise<any> {
    this.setGeocoder();
    return new Promise((resolve, reject) => {
      this.geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve({ lat: result[0].y, lng: result[0].x });
        } else {
          reject("error");
        }
      });
    });
  }

  getCurrentPositionMap(elementId: string, lat: string, lng: string) {
    const map = this.initMap(elementId, {
      center: new kakao.maps.LatLng(lat, lng),
      level: 4,
      disableDoubleClickZoom: true,
    });

    const coords = new kakao.maps.LatLng(lat, lng);

    const marker = new kakao.maps.Marker({
      position: coords,
      image: this.getMyMarkImage(),
    });
    marker.setMap(map);

    map.setCenter(coords);
    // this.setMapDraggable(map, false);
    // this.setZoomable(map, false);

    return map;
  }

  private setGeocoder() {
    console.log("kakao.maps.services.", kakao.maps);
    if (!this.geocoder) {
      this.geocoder = new kakao.maps.services.Geocoder();
    }
  }

  private getMyMarkImage(): any {
    return new kakao.maps.MarkerImage(
      "/assets/icons/my-map.png",
      new kakao.maps.Size(54, 54),
      { offset: new kakao.maps.Point(27, 27) }
    );
  }

  getMarkImage(color: string = "green"): any {
    return new kakao.maps.MarkerImage(
      `/assets/icons/pin-${color}-small.png`,
      new kakao.maps.Size(54, 54),
      { offset: new kakao.maps.Point(27, 27) }
    );
  }

  getActiveMarkImage(color: string = "green"): any {
    return new kakao.maps.MarkerImage(
      `/assets/icons/pin-${color}.png`,
      new kakao.maps.Size(78, 89),
      { offset: new kakao.maps.Point(39, 79) }
    );
  }

  reLayout(map, lat, lng): void {
    setTimeout(() => {
      map.relayout();
      const coords = new kakao.maps.LatLng(lat, lng);
      map.setCenter(coords);
    });
  }
}
