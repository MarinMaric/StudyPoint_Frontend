import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../FileUploadService";
import {CourseDetailsVM} from "../../CourseDetails";
import {MyConfig} from "../../MyConfig";
import {LessonDetailsVM} from "../../LessonDetailsVM";

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
      this.fileUploadService.UploadLesson(this.lessonID, this.courseID, this.title, this.description, this.file).subscribe(
        (event: any) => {
          if (typeof (event) === 'object') {

            this.loading = false;
          }
        }
      );
    }
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
