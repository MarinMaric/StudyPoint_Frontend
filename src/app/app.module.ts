import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { ViewCoursesComponent } from './TeacherComponents/view-courses/view-courses.component';
import { EditCourseComponent } from './TeacherComponents/edit-course/edit-course.component';
import { CourseDetailsComponent } from './TeacherComponents/course-details/course-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ViewCoursesComponent,
    EditCourseComponent,
    CourseDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'view-courses', component: ViewCoursesComponent},
      {path: 'edit-course', component: EditCourseComponent},
      {path: 'course-details', component: CourseDetailsComponent}
    ]),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
