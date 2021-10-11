import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../FileUploadService";
import {CourseDetailsVM} from "../../CourseDetails";
import {MyConfig} from "../../MyConfig";
import {LessonDetailsVM} from "../../LessonDetailsVM";
import {Subscription} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.css']
})
export class EditLessonComponent implements OnInit {
  @Input() lessonID:number;

  shortLink: string = "";
  loading: boolean = false;
  file:File;
  title:string;
  description:string;
  videoDisplay:string;
  videoType:string;
  courseID:number;
  showError:boolean=false;
  uploadProgress:number;
  uploadSub: Subscription;
  progressNum:number;

  constructor(private http:HttpClient, private route:ActivatedRoute, private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.lessonID = Number(params.get('lessonID'))
    )

    if(this.lessonID!=undefined)
      this.InitializeParameters();
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
        let lessonId:any=this.lessonID;
        formData.append("id", lessonId );
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

    /*if(!this.Validate()){
      this.fileUploadService.UploadLesson(this.lessonID, this.courseID, this.title, this.description, this.file).subscribe(
        (event: any) => {
          if (typeof (event) === 'object') {

            this.loading = false;
          }
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

  InitializeParameters(){
    this.http.get<LessonDetailsVM>(MyConfig.webAppUrl+'/Lesson/LessonDetails/'+this.lessonID).subscribe((result:LessonDetailsVM)=>{
      this.title=result.title;
      this.description=result.description;
      this.videoDisplay=result.videoDisplay;
      this.courseID=result.courseId;
      this.videoType=result.videoType;
    });
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
