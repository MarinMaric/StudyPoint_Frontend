import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {CourseDetailsVM} from "../../CourseDetails";
import {MyConfig} from "../../MyConfig";
import { FileUploadService } from '../FileUploadService';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  @Input() courseID:number;
  courseDetails:CourseDetailsVM;

  constructor(private http:HttpClient, private route:ActivatedRoute, private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.courseID = Number(params.get('courseID'))
    )
    this.CourseDetails();
  }
  CourseDetails(){
    this.http.get<CourseDetailsVM>(MyConfig.webAppUrl+'/Teacher/CourseDetails/'+this.courseID).subscribe((result:CourseDetailsVM)=>{
      this.courseDetails=result;

      if(this.courseDetails.imageDisplay!=undefined){
        this.loadImage();
      }
    });
  }

  loadImage() {
    this.loginImg().subscribe(result => {
      this.courseDetails.imageBlob = result;
      this.createImageFromBlob(this.courseDetails.imageBlob);
    });
  }

  loginImg() {
    const url = MyConfig.webAppUrl+"/Teacher/LoadImage?courseId="+this.courseID;
    return this.http.get(url, { responseType: 'blob' });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.courseDetails.imageFromBlob = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
