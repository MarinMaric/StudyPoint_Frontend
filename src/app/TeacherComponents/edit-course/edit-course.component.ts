import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../FileUploadService";
import {CourseDetailsVM} from "../../CourseDetails";
import {MyConfig} from "../../MyConfig";

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  @Input() courseID:number;

  shortLink: string="";
  loading: boolean = false;
  file:File;
  title:string;
  description:string;
  imageDisplay:string;
  imageBlob:Blob;
  showError:boolean;
  imageFromBlob:any;
  apiUrl:string;

  constructor(private http:HttpClient, private route:ActivatedRoute, private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.courseID = Number(params.get('courseID'))
    )

    if(this.courseID!=undefined)
      this.InitializeParameters();
  }

  imageUpload(event) {
    this.file = event.target.files[0];
  }

  onUpload() {
    this.loading = !this.loading;

    if(!this.Validate()){
      this.fileUploadService.UploadCourse(this.courseID, this.title, this.description, this.file).subscribe(
        (event: any) => {
          if (typeof (event) === 'object') {

            this.loading = false;
          }
        }
      );
    }
  }

  InitializeParameters(){
    this.http.get<CourseDetailsVM>(MyConfig.webAppUrl+'/Teacher/CourseDetails/'+this.courseID).subscribe((result:CourseDetailsVM)=>{
      this.title=result.title;
      this.description=result.description;
      this.imageDisplay=result.imageDisplay;

      if(this.imageDisplay!=undefined){
        this.loadImage();
      }
    });
  }

  loadImage() {
    this.loginImg().subscribe(result => {
      this.imageBlob = result;
      this.createImageFromBlob(this.imageBlob);
    });
  }

  loginImg() {
    const url = MyConfig.webAppUrl+"/Teacher/LoadImage?courseId="+this.courseID;
    return this.http.get(url, { responseType: 'blob' });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageFromBlob = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  Validate():boolean{
    if(this.file!=undefined && this.file.size>10485760)
      this.showError=true;
    else if(this.title==undefined || this.title=="")
      this.showError=true;
    else if(this.description==undefined || this.description=="")
      this.showError=true;
    else this.showError=false;

    return this.showError;
  }
}
