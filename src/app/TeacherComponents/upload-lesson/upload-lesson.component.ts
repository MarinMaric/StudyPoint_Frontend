import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../FileUploadService";
import {MyConfig} from "../../MyConfig";
import {finalize} from "rxjs/operators";
import {Subscription} from "rxjs";

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
  uploadProgress:number;
  uploadSub: Subscription;
  progressNum:number;
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
      if (this.file) {
        var tokenTest = localStorage.getItem('loginToken');
        var token = tokenTest !== null ? tokenTest : '{}';

        const formData = new FormData();
        let courseId:any=this.courseID;
        let lessonId:any=0;
        formData.append("id", lessonId )
        formData.append("courseId", courseId);
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("video", this.file, this.file.name);

        let headers = new HttpHeaders({
          'MojAutentifikacijaToken':token
        });
        const upload$ = this.http.post(MyConfig.webAppUrl+"/Lesson/UploadLesson", formData, {
          reportProgress: true,
          observe: 'events',
          headers:headers
        })
          .pipe(
            finalize(() => this.reset())
          );

        this.uploadSub = upload$.subscribe(event => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
            this.progressNum=this.uploadProgress;
          }
        },error => {
          alert("Upload failed");
        })
      }
    }
/*    if(!this.Validate()){
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
    }*/
  }

  cancelUpload(){
    this.uploadSub.unsubscribe();
    this.reset();
  }
  reset(){
    this.uploadProgress = null;
    this.uploadSub = null;
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
