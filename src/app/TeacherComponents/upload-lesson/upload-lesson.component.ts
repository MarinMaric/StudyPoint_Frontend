import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../FileUploadService";

@Component({
  selector: 'app-upload-lesson',
  templateUrl: './upload-lesson.component.html',
  styleUrls: ['./upload-lesson.component.css']
})
export class UploadLessonComponent implements OnInit {
  @Input() courseID:number;

  shortLink: string = "";
  loading: boolean = false;
  file:File;
  title:string;
  description:string;
  videoBlob:string;
  videoFromBlob:string;
  videoDisplay:string;

  showError:boolean;

  apiUrl:string;

  constructor(private http:HttpClient, private route:ActivatedRoute, private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.courseID = Number(params.get('courseID'))
    )
  }

  imageUpload(event) {
    this.file = event.target.files[0];
  }

  onUpload() {
    this.loading = !this.loading;

    if(!this.Validate()){
      this.fileUploadService.UploadLesson(null, this.courseID, this.title, this.description, this.file).subscribe(
        (event: any) => {
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
