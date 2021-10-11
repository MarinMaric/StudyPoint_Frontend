import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
    var tokenTest = localStorage.getItem('loginToken');
    var token = tokenTest !== null ? tokenTest : '{}';
    const headerDict = {
      'Content-Type': 'application/json',
      'MojAutentifikacijaToken': token
    };

    const requestOptions = {
      headers: new HttpHeaders (headerDict),
    };
    this.http.get<LessonDetailsVM>(MyConfig.webAppUrl+'/Lesson/LessonDetails/'+this.lessonID, requestOptions).subscribe((result:LessonDetailsVM)=>{
      this.lessonDetails=result;

      if(this.lessonDetails.videoDisplay!=undefined){
        let fullLink=MyConfig.appFilesUrl+this.lessonDetails.videoDisplay;
        this.lessonDetails.videoDisplay=fullLink;
      }
    });
  }
  SetProgress(){
    var tokenTest = localStorage.getItem('loginToken');
    var token = tokenTest !== null ? tokenTest : '{}';
    const headerDict = {
      'Content-Type': 'application/json',
      'MojAutentifikacijaToken': token
    };
    const requestOptions = {
      headers: new HttpHeaders (headerDict),
    };

    this.http.get(MyConfig.webAppUrl+'/Student/CheckProgress?lessonId='+this.lessonID,requestOptions).subscribe((result)=>{
      this.http.post<LessonBriefVM>(MyConfig.webAppUrl+'/Student/SetProgress?lessonId='+this.lessonID,null,requestOptions).subscribe((result)=>{
      },error=>{
      });
    });

  }
}
