import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {CourseDetailsVM} from "../../CourseDetails";
import {MyConfig} from "../../MyConfig";
import { FileUploadService } from '../FileUploadService';
import {LessonBriefVM} from "../../LessonBriefVM";

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  @Input() courseID:number;
  courseDetails:CourseDetailsVM;
  title:string;
  currentPage:number=0;
  colSize:number;
  itemsPerPage:number=5;
  filterNaziv:string="";
  appFilePath:string=MyConfig.appFilesUrl;

  constructor(private http:HttpClient, private route:ActivatedRoute, private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.courseID = Number(params.get('courseID'))
    )
    this.CourseDetails();
  }
  CourseDetails(){
    var tokenTest = localStorage.getItem('loginToken');
    var token = tokenTest !== null ? tokenTest : '{}';
    const headerDict = {
      'Content-Type': 'application/json',
      'MojAutentifikacijaToken': token
    };

    const requestOptions = {
      headers: new HttpHeaders (headerDict),
    };
    this.http.get<CourseDetailsVM>(MyConfig.webAppUrl+'/Teacher/CourseDetails/'+this.courseID, requestOptions).subscribe((result:CourseDetailsVM)=>{
      this.courseDetails=result;

      this.ViewLessons();
    });
  }

  ViewLessons(){
    let url:string = MyConfig.webAppUrl + "/Lesson/ViewLessons";
    var tokenTest = localStorage.getItem('loginToken');
    var token = tokenTest !== null ? tokenTest : '{}';

    url+="?id="+this.courseID;
    if(this.currentPage!=0)
      url+="&currentPage="+this.currentPage+"&itemsPerPage="+this.itemsPerPage+"&filter="+this.filterNaziv;

    const headerDict = {
      'Content-Type': 'application/json',
      'MojAutentifikacijaToken': token
    };

    const requestOptions = {
      headers: new HttpHeaders (headerDict),
    };
    this.http.get<number>(MyConfig.webAppUrl+"/Lesson/CollectionSize?filter="+this.filterNaziv, requestOptions).subscribe((result:number)=>{
      this.colSize=result;
    })
    this.http.get<LessonBriefVM[]>(url, requestOptions).subscribe((result:LessonBriefVM[])=>{
        this.courseDetails.lessons=result;
      },error => {
        alert("hmm");
      }
    );
  }

  loadPage($event:any){
    this.ViewLessons();
  }

  filterLessons():Array<LessonBriefVM>{
    return this.courseDetails.lessons;
  }

  SearchButton(){
    this.currentPage=1;
    this.ViewLessons();
  }

  DeleteLesson(i:LessonBriefVM){
    this.http.get(MyConfig.webAppUrl+'/Lesson/DeleteLesson?lessonId='+i.lessonId).subscribe((result)=>{
      var indexOf=this.courseDetails.lessons.indexOf(i);
      this.courseDetails.lessons.splice(indexOf, 1);
    });
  }
}
