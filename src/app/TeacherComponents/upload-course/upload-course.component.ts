import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../FileUploadService";
import {CourseDetailsVM} from "../../CourseDetails";
import {MyConfig} from "../../MyConfig";

@Component({
  selector: 'app-upload-course',
  templateUrl: './upload-course.component.html',
  styleUrls: ['./upload-course.component.css']
})
export class UploadCourseComponent implements OnInit {
  shortLink: string = "";
  loading: boolean = false;
  file:File;
  title:string;
  description:string;
  imageShow:string;

  showError:boolean;

  apiUrl:string;

  constructor(private http:HttpClient, private route:ActivatedRoute, private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {

  }

  zanrChange(event) {

  }
  imageUpload(event) {
    this.file = event.target.files[0];
  }

  onUpload() {
    this.loading = !this.loading;

    if(!this.Validate()){
      this.fileUploadService.UploadCourse(null, this.title, this.description, this.file).subscribe(
        (event: any) => {
          alert("Course uploaded!");

          if (typeof (event) === 'object') {

            // Short link via api response
            this.shortLink = event.link;

            this.loading = false; // Flag variable

          }
        },
        error => {
          alert("Title is taken");
        }
      );
    }
  }

  Validate():boolean{
    if(this.title==undefined || this.title=="")
      this.showError=true;
    else if(this.description==undefined || this.description=="")
      this.showError=true;
    else this.showError=false;

    return this.showError;
  }

}
