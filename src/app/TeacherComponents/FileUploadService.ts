import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MyConfig} from "../MyConfig";
import {CourseDetailsVM} from "../CourseDetails";
import {CourseBrief} from "../CourseBrief";
import {describeResolvedType} from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  apiUrl:string;

  constructor(private http:HttpClient) { }


  UploadCourse(courseId, title, description, file):Observable<any> {
    var tokenTest = localStorage.getItem('loginToken');
    var token = tokenTest !== null ? tokenTest : '{}';

    const formData = new FormData();
    if(courseId!=undefined){
      formData.append("courseId", courseId);
    }else{
      courseId=0;
    }
    formData.append("title", title);
    formData.append("description", description);

    if(file!=undefined){
      formData.append("image", file, file.name);
    }

    let headers = new HttpHeaders({
      'MojAutentifikacijaToken':token
    });
    let options = { headers: headers };
    return this.http.post<string>(MyConfig.webAppUrl+"/Teacher/UploadCourse", formData, options);
  }

  UploadLesson(lessonId, courseId, title, description, file):Observable<any> {
    var tokenTest = localStorage.getItem('loginToken');
    var token = tokenTest !== null ? tokenTest : '{}';

    const formData = new FormData();
    if(lessonId!=undefined){
      formData.append("id", lessonId);
    }else{
      lessonId=0;
    }
    formData.append("courseId", courseId);
    formData.append("title", title);
    formData.append("description", description);

    if(file!=undefined){
      formData.append("video", file, file.name);
    }

    let headers = new HttpHeaders({
      'MojAutentifikacijaToken':token
    });
    let options = { headers: headers };
    return this.http.post<string>(MyConfig.webAppUrl+"/Lesson/UploadLesson", formData, options);
  }
}
