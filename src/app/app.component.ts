import { RouterOutlet } from '@angular/router';
import { Component, AfterViewInit, ViewChild, ElementRef, DoCheck } from '@angular/core';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements AfterViewInit {

  eventMouseClickX:any  = null;
  eventMouseClickY:any  = null;
  pointXOfDetectedObjectHistory =null;
  pointYOfDetectedObjectHistory =null;

  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  @ViewChild('webcam', { static: false }) webcam!: ElementRef;
  @ViewChild('image', { static: false }) image!: ElementRef;

  private imageElement: HTMLImageElement;
  private canvasElement: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvasElement = this.canvas?.nativeElement;
    this.imageElement = this.image?.nativeElement;
    this.video = <HTMLVideoElement>document.getElementById('vid');
    this.ctx = this.canvasElement?.getContext('2d')!;
  }
  ngAfterViewInit() {
    this.canvasElement = this.canvas?.nativeElement;
    this.imageElement = this.image?.nativeElement;
    this.ctx = this.canvasElement?.getContext('2d')!;
    this.video = <HTMLVideoElement>document.getElementById('vid');

    // forImage
    // this.startDetection()
  }
  
//   modelPromise: any;
//   startDetection() {
//     this.modelPromise = cocoSsd.load(
//   {base:'mobilenet_v1'});

//     cocoSsd.load().then(model => {
//       // detect objects in the image.
//       model.detect(this.imageElement).then(predictions => {
//         debugger;
//         console.log('Predictions: ', predictions);
//       });
//     });

//   }

//   // for Image detection
// onclick = async (e: any) => {
//   console.log(e.clientX);
//   console.log(e.clientY);
//     cocoSsd.load( {base:'mobilenet_v1'}).then(model => {
//       // detect objects in the image.
//       model.detect(this.imageElement).then(predictions => {
//         debugger;
//         console.log('Predictions: ', predictions);
//   const context = this.canvasElement.getContext('2d') ;
//   if(context){
//     context.drawImage(this.imageElement, 0, 0);
//     context.font = '10px Arial';
  
//     console.log('number of detections: ', predictions.length);
//     for (let i = 0; i < predictions.length; i++) {
//       context.beginPath();
//       let box= predictions[i].bbox;
//       let endxpoint= box[0]+box[2];
//       let endypoint= box[1]+box[3];
// if(e.clientX > box[0] && e.clientX < endxpoint && e.clientY > box[1] && e.clientY < endypoint) {
//       context.rect(box[0],box[1],box[2],box[3]);
//       context.lineWidth = 1;
//       context.strokeStyle = 'green';
//       context.fillStyle = 'green';
//       context.stroke();
//       context.fillText(
//         predictions[i].score.toFixed(3) + ' ' + predictions[i].class, predictions[i].bbox[0],
//         predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10);
//     }
//   }
//   }

//       });
//     });  
// };



// test video
title = 'TF-ObjectDetection';
private video: HTMLVideoElement ;
public innerWidth: any;
public innerHeight: any;
public loadingModel: boolean =true;
public colorScheme: any;

@HostListener('window:resize', ['$event'])
onResize(event:any) {
  this.innerWidth = window.innerWidth;
  this.innerHeight = window.innerHeight;
  this.video.width = this.innerWidth;
  this.video.height = this.innerHeight;
}


ngOnInit() {
  this.loadingModel = true;
  this.video = <HTMLVideoElement>document.getElementById('vid');
  this.innerWidth = window.innerWidth;
  this.innerHeight = window.innerHeight;
  this.video.width = this.innerWidth;
  this.video.height = this.innerHeight;
  this.video.onloadedmetadata = () => {
    this.video.play();
    this.predictWithCocoModel();
  };
}


public async predictWithCocoModel() {
  const model = await cocoSsd.load();
  //detect frame
  this.detectFrame(this.video, model, true);
  this.loadingModel = false;
}


detectFrame = (video : HTMLVideoElement, model: cocoSsd.ObjectDetection, first_time: any) => {
  model.detect(video).then(predictions => {
    this.renderPredictions(predictions);
    requestAnimationFrame(() => {
      this.detectFrame(video, model, false);
    });
  });
}

renderPredictions(predictions : any[]) {

  // const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const ctx = this.canvasElement.getContext('2d');
  this.canvasElement.width = this.innerWidth;
  this.canvasElement.height = this.innerHeight;


  if(ctx){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = '22px "Quicksand"';
    ctx.font = font;
    ctx.textBaseline = 'top';


    ctx.drawImage(this.video, 0, 0, this.innerWidth, this.innerHeight);
  
    predictions.forEach(prediction => {
  
      // keep predictions with at less 0.7 accurrate
      /* const accurrate = 0.7;
      if (prediction.score < accurrate) {
        return;
      } */
        let box= prediction.bbox;
        let endxpoint= box[0]+box[2];
        let endypoint= box[1]+box[3];
   
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
  
      // Define color by object class + some number to generate different colors
      //this.colorScheme = generate(prediction.class + ctx.measureText(prediction.class).width);
      if((this.eventMouseClickX > box[0] && this.eventMouseClickX < endxpoint &&
        this.eventMouseClickY > box[1] && this.eventMouseClickY < endypoint) || !this.eventMouseClickX) {
     
      // Draw the bounding box.
      this.roundRect(ctx, x, y, width, height, 5, true, true, 'green');
      ctx.lineWidth = 1;

      this.pointXOfDetectedObjectHistory = (this.pointXOfDetectedObjectHistory == null)? prediction.bbox[0]  : this.pointXOfDetectedObjectHistory 
      if(this.eventMouseClickX && this.pointXOfDetectedObjectHistory != prediction.bbox[0]  ){
let differenceWithDirectionX =  (this.pointXOfDetectedObjectHistory??0) - prediction.bbox[0] 
let differenceWithDirectiony =  (this.pointYOfDetectedObjectHistory??0) - prediction.bbox[1] 
        this.eventMouseClickX += differenceWithDirectionX;
        this.eventMouseClickY += differenceWithDirectiony;
      }
       console.log(prediction)
      // Draw the label background.
      ctx.fillStyle = 'green';
      const textWidth = ctx.measureText(prediction.class).width + ctx.measureText(prediction.score.toFixed(3)).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 2, textHeight + 2);
  
  
      // Draw the center of the box
      ctx.fillRect(x + width / 2, y + height / 2, 5, 5);
        }
    });
  
    predictions.forEach(prediction => {
  
  
    
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(prediction.class + ' , id: '+ prediction.id+ " " + Math.round(prediction.score * 100) / 100, x, y);
    });
  }
  

}

/**
* Draws a rounded rectangle using the current state of the canvas.
* If you omit the last three params, it will draw a rectangle
* outline with a 5 pixel border radius
* @param {CanvasRenderingContext2D} ctx
* @param {Number} x The top left x coordinate
* @param {Number} y The top left y coordinate
* @param {Number} width The width of the rectangle
* @param {Number} height The height of the rectangle
* @param {Number} [radius = 5] The corner radius; It can also be an object
*                 to specify different radii for corners
* @param {Number} [radius.tl = 0] Top left
* @param {Number} [radius.tr = 0] Top right
* @param {Number} [radius.br = 0] Bottom right
* @param {Number} [radius.bl = 0] Bottom left
* @param {Boolean} [fill = false] Whether to fill the rectangle.
* @param {Boolean} [stroke = true] Whether to stroke the rectangle.
*/
roundRect(ctx :CanvasRenderingContext2D, x : number, y: number, width: number, height: number, radius?: any, fill?:boolean, stroke?: boolean, color?: string) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number' ) {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || 0;
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill && color) {
    ctx.fillStyle = color;
  }
  if (stroke && color) {
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }

}


public showAlert(e:MouseEvent) {
 
  this.eventMouseClickX = e.clientX;
  this.eventMouseClickY = e.clientY
}


}


