import { Injectable, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoCodingServiceService{
  public constructor(private http: HttpClient) { }

  private key = "AIzaSyDy0xDgkk5udz0GwJbBXWNp3TmsVQaR0_I";
  public verifiedAddress  = new Subject<boolean>();
  b = "b";

  public checkAddress(address: string): Observable<boolean>{
    var geocoder = new google.maps.Geocoder();

    return new Observable(observer => {
      geocoder.geocode({'address': address}, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      });
    })

    geocoder.geocode({'address':address}, function(results, status) {
      if (status === 'OK') {
        return true;
      }
      else{
        return false;
      }
    });
  }

  nextvalue(value: boolean){
    this.verifiedAddress.next(value);
  }

  public LatLon(address: string, map: google.maps.Map, gmap: ElementRef):void{
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address':address}, function(results, status) {
      if (status === 'OK') {
        this.mapOptions  = {
          center:results[0].geometry.location
          ,
          zoom: 16
        }; 
        this.map = new google.maps.Map(gmap.nativeElement,this.mapOptions);
        this.marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map
        });
        this.marker.setMap(this.map);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
        return null;
      }
    });
    return null;
  }
}
