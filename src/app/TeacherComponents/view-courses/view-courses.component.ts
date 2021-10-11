import { Component, OnInit } from '@angular/core';
import {CourseBrief} from "../../CourseBrief";
import {MyConfig} from "../../MyConfig";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  styleUrls: ['./view-courses.component.css']
})
export class ViewCoursesComponent implements OnInit {
  courses:CourseBrief[];
  title:string;
  currentPage:number=0;
  colSize:number;
  itemsPerPage:number=5;
  filterNaziv:string="";
  appFilePath:string=MyConfig.appFilesUrl;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.ViewCourses();
  }

  ViewCourses(){
    let url:string = MyConfig.webAppUrl + "/Teacher/ViewCourses";
    var tokenTest = localStorage.getItem('loginToken');
    var token = tokenTest !== null ? tokenTest : '{}';

    if(this.currentPage!=0)
      url+="?currentPage="+this.currentPage+"&itemsPerPage="+this.itemsPerPage+"&filter="+this.filterNaziv;

    const headerDict = {
      'Content-Type': 'application/json',
      'MojAutentifikacijaToken': token
    };

    const requestOptions = {
      headers: new HttpHeaders (headerDict),
    };
    this.http.get<number>(MyConfig.webAppUrl+"/Teacher/CollectionSize?filter="+this.filterNaziv, requestOptions).subscribe((result:number)=>{
      this.colSize=result;
    })
    this.http.get<CourseBrief[]>(url, requestOptions).subscribe((result:CourseBrief[])=>{
        this.courses=result;
      },error => {
        alert("hmm");
      }
    );
  }
  EditCourse(i:CourseBrief){}
  DeleteCourse(i:CourseBrief){
    this.http.delete(MyConfig.webAppUrl+'/Teacher/DeleteCourse?courseId='+i.courseId).subscribe((result)=>{
      var indexOf=this.courses.indexOf(i);
      this.courses.splice(indexOf, 1);
    });
  }

  loadPage($event:any){
    this.ViewCourses();
  }
  filterCourses():Array<CourseBrief>{

    return this.courses;
  }

  SearchButton(){
    this.currentPage=1;
    this.ViewCourses();
  }

}
