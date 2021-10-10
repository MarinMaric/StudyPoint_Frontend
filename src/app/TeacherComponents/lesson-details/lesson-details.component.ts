import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../FileUploadService";
import {CourseDetailsVM} from "../../CourseDetails";
import {MyConfig} from "../../MyConfig";
import {LessonDetailsVM} from "../../LessonDetailsVM";
import {LessonBriefVM} from "../../LessonBriefVM";

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css']
})
export class LessonDetailsComponent implements OnInit {
  @Input() lessonID:number;
  lessonDetails:LessonDetailsVM;

  constructor(private http:HttpClient, private route:ActivatedRoute, private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.lessonID = Number(params.get('lessonID'))
    )
    this.LessonDetails();
  }
  LessonDetails(){
    this.http.get<LessonDetailsVM>(MyConfig.webAppUrl+'/Lesson/LessonDetails/'+this.lessonID).subscribe((result:LessonDetailsVM)=>{
      this.lessonDetails=result;

      if(this.lessonDetails.videoDisplay!=undefined){
        let fullLink=MyConfig.appFilesUrl+this.lessonDetails.videoDisplay;
        this.lessonDetails.videoDisplay=fullLink;
      }
    });
  }
}
