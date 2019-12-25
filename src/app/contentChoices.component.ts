// c:\users\ASP0363\appdata\roaming\code\user\settings.json
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild, ElementRef, HostListener} from '@angular/core';
  //Directive, EventEmitter, Output   } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentChoice } from './contentChoice';
import { ProductGridListItem } from './productGridList';
import { DcFormatListItem } from './dcFormatList';
import { FormatDetail } from './formatDetail';
import { SkuFormat } from './skuFormat';
import { MaskAndText } from './maskAndText';
import { FormatCompose } from './formatCompose';
import { FormatLiteral } from './formatLiteral';
import { FormatMask } from './formatMask';
import { ContentUsageCount } from './contentUsageCount';
import { SkuUsageCount } from './skuUsageCount';
import { FormatUsageCount } from './formatUsageCount';
import * as XLSX from 'xlsx'; // as XLSX creates the NAMESPACE XLSX
import { get_table } from 'ssf/types';
// import { getHostElement } from '@angular/core/src/render3';  //
// import { findIndex } from 'rxjs/operators';
// import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';
// import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';

type AOA = any[][];           // array of arrays
@Component({
  selector: 'app-selector1'    // tied to app.component.html
  , templateUrl: 'contentChoices.component.html'
  , changeDetection: ChangeDetectionStrategy.OnPush
})
// @Directive({ selector: '[clickElsewhere]' })

export class ContentChoicesComponent implements OnInit   {
  // declare properties of this component.
  // arrays here are used by contentChoices.component.html (ngfor)
  contentChoiceArray1: ContentChoice[];
  productGridArray0: ProductGridListItem[];
  productGridArray1: ProductGridListItem[];
  dateCodeFormatArray0: DcFormatListItem[];  // raw list
  dateCodeFormatArray1: DcFormatListItem[];  // filtered list
  formatDetailArray0: FormatDetail[];  // raw list
  formatDetailArray1: FormatDetail[];   // filtered list
  formatDetailArray2: FormatDetail[];   // filtered list
  skuFormatArray0: SkuFormat[];
  skuFormatArray1: SkuFormat[];
  formatComposeArray0: FormatCompose[];
  // formatComposeArray1:  FormatCompose[];
  maskAndTextArray0: MaskAndText[];
  formatLiteralArray0: FormatLiteral[];
  formatLiteralArray1: FormatLiteral[];
  formatMaskArray0: FormatMask[];
  formatMaskArray1: FormatMask[];
  formatMaskArrayLots: FormatMask[];
  formatMaskArrayDates: FormatMask[];
  formatMaskArrayLotsOrDates: FormatMask[];
  ccFreqArray0: ContentUsageCount[];
  dfFreqArray0: FormatUsageCount[];
  suFreqArray0: SkuUsageCount[];
  dfCount = 0; // how many formats are in the df format list
  suCount = 0; // how many skus are in the su sku usage list
  sfCount = 0; // how many item/layer/fmt are in the sf list
  fdCount = 0; // how many format detail recs are in the fd list
  flCount = 0; // how many format literals exist in the fl list
  fmCount = 0; // how many format masks exist in the fm list
  // myXlHdgMsg: string =  ' Import Format data from Excel   ===> ' ; This page is for finding Date Code Formats that fit your criteria.
  mainMsg = '  ** Search the Format Catalog ** ';
  importingMsg = '';
  helpMsg = 'First, import from XL. '
        + ' Formats are listed under the Format Catalog heading'
        + ' on the right.  Hit the plus-sign to see them.'
        + ' Are you looking for Formats that fit certain criteria?'
        + ' Drag & drop from the Content area on the left'
        + ' to the Product Grid area in the middle.'
        + ' Drop Content into the upper section of the Product Grid '
        + ' when you do not know the exact line and slot. '
        + ' This will match Content to anywhere on the Product Grid.'
        + ' Drop Content into the lower section of the Product Grid  '
        + ' when you want to match an exact line and slot.'
        + ' Each drag-and-drop will further filter the Format list.'
        + ' Also, you can enter a full or partial Item Number'
        + ' to search for Formats used by certain Items.'
        + ' This message will appear only for your first 5 visits.'
        ;
  myModal1Msg1 = 'modal1 header info goes here';
  dp1a = '';
  dp1b = '';
  dp1c = '';
  dp1d = '';
  dp2a = '';
  dp2b = '';
  dp2c = '';
  dp2d = '';

  myModal1Msg2 = 'more modal1 info goes here';
  dpHeadRight = 'dp header right info goes here';

  dragHelpMsg = 'drag & drop';
  dragHelpOn = true;
  ccOn = true;
  pgOn = true;
  dpOn = false;
  xiOn = true;
  plHide = true;  // prompt for literal
  pmHide = true;  // prompt for Mask with OK Cancel buttons
  pmmHide = true;  // prompt for Mask
  pgLitInput = '';
  pgMaskInput = '';
  ccDivHead = 'Content';
  pgDivHead = 'Product Grid';
  dfHelpMsg = 'click + to expand a list';
  pg0HelpMsg = 'drop here to filter by any line/slot';
  pg1HelpMsg = 'drop here to filter by a specific line/slot ';
  selectedDF: DcFormatListItem;
  selectedCC: ContentChoice;
  selectedFD: FormatDetail;
  selectedPg1: ProductGridListItem;
  selectedPg0: ProductGridListItem;
  fc: FormatCompose;
  sf: SkuFormat;
  mt: MaskAndText;
  fl: FormatLiteral;
  whatCcIamDragging: ContentChoice;
  whatPgIamDropping: ProductGridListItem;
  xlData: AOA = [[1, 2], [3, 4]]; //  aoa means 'array of arrays'
  itemToSearchFor = '';
  firstScreenYN = 'Y';
  dfListOn = false;
  scListOn = false;
  sfListOn = false;
  fdListOn = false;
  flListOn = false;
  fmListOn = false;
  urlHitCount = 0;
  dacoVisitCountKeyName = 'dacoVisitCountKey';
  dacoVisitCount = 0;
  whichBrowser = '';
  exampleDate = '20190731';
  exampleExpDate = '20210731';
  // dropdown experiment
  maskDropDownChoices = [
  {"id":"001","maskChoiceName":"NNNNAMCX"},
  {"id":"002","maskChoiceName":"NNNNAMC"},
  {"id":"003","maskChoiceName":"NAMCX"},
  {"id":"003","maskChoiceName":"NAMC"},
  {"id":"005","maskChoiceName":"AMC"}
];
  showMaskDropDownYn: boolean = false;
  pgTarget: any;
  latestTarget: any;
  @ViewChild('litInputHtml')   litInputName: ElementRef;
  @ViewChild('pgIdSaveHtml')   pgIdSave:     ElementRef;
  @ViewChild('pg0Or1SaveHtml') pg0Or1Save:   ElementRef;
  @ViewChild('maskInputHtml')  maskInputName: ElementRef;
 // @Output() clickElsewhere = new EventEmitter<MouseEvent>();
  @HostListener('body:mouseup', ['$event'])
    onMouseUp(evtParmIn: MouseEvent) {
      this.chkMouseClick(evtParmIn);
    }
  // //
  // // Mar 22
  // @HostListener('document:click', ['$event'])
  //   onDocumentClick(event: MouseEvent): void {
  //   // -alert('onDocCK')
  //   const targetElement = event.target as HTMLElement;
  //     // Check if the click was outside the element
  //     if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
  //        this.clickElsewhere.emit(event);
  //     }
  // } // Mar 22

  ///////////////////////////////////////////////////////////////////
  constructor(
    private cdr: ChangeDetectorRef
    // private elementRef: ElementRef
    // services are hard. we removed services,
    // and put their code in this component. hooray!
  ) { }

  ngOnInit() {
    this.detectBrowser();
    this.getVisitCount();
    this.setVisitCount();
    this.chkNaggyHelp();
    this.initDummyArrays();
    this.getCcDfLocalStorage(); // iflocal storage exists, this will get it
    this.dfFilter();
  }

  delPgItem(pgParmIn: ProductGridListItem) {
    // -alert('running delPgItem');
    // a delete is really a 'blank out'.
    pgParmIn.pgContentName = '----------';
    pgParmIn.pgContentShow = '----------';
    pgParmIn.pgContentId = 0;
    pgParmIn.pgContentType = '???';
    pgParmIn.pgMask = ' ';
    this.chgPgItem(pgParmIn);
  }

  chgDFItem(dfParmIn: DcFormatListItem) {
    let i = this.dateCodeFormatArray0.findIndex(x => x.dfFormatKey == dfParmIn.dfFormatKey);
    this.dateCodeFormatArray0[i] = dfParmIn;
  }

  chgPgItem(pgParmIn: ProductGridListItem) {
    // -alert('running chgPGItem0');
    let i = this.productGridArray1.findIndex(x => x.id == pgParmIn.id);
    this.productGridArray1[i] = pgParmIn;
  }

  addCC(ParmIn: string) {
    this.selectedCC = new ContentChoice;
    this.selectedCC.id = 1;
    this.selectedCC.contentUsageCount = 0;
    this.selectedCC.contentName = ParmIn;
    this.selectedCC.contentMask = '';
    if (this.selectedCC.contentName == 'Literal') {
      this.selectedCC.contentType = 'lit';
    } else {
      this.selectedCC.contentType = 'jwf';
    }
    this.contentChoiceArray1.push(
      {
        id: this.selectedCC.id,
        contentName: this.selectedCC.contentName,
        contentType: this.selectedCC.contentType,
        contentMask: this.selectedCC.contentMask,
        contentUsageCount: this.selectedCC.contentUsageCount
      }
    );
  }

  addDF(xlParmIn: string) {
    this.selectedDF = new DcFormatListItem;
    this.selectedDF.id = null;
    this.selectedDF.dfFilterInOut = 'init';
    this.selectedDF.dfUsageCount = 111;
    let firstComma = xlParmIn.toString().indexOf(',');
    this.selectedDF.dfFormatKey = xlParmIn.toString().substring(0, firstComma);
    firstComma = firstComma + 1;
    let firstCommaComma = xlParmIn.toString().indexOf(',,');
    this.selectedDF.dfFormatName = xlParmIn.toString().substring(firstComma, firstCommaComma);

    // Jan2019 xl has caret now, so replace with ,
    // let r: string = this.selectedDF.dfFormatName .replace('^',',');
    let r = this.selectedDF.dfFormatName.split('^').join(',');

    this.selectedDF.dfFormatName = r;
    this.dateCodeFormatArray0.push(
      {
        id: this.selectedDF.id,
        dfFormatKey: this.selectedDF.dfFormatKey,
        dfFormatName: this.selectedDF.dfFormatName,
        dfFormatDesc: this.selectedDF.dfFormatDesc,
        dfFilterInOut: this.selectedDF.dfFilterInOut,
        dfUsageCount:  this.selectedDF.dfUsageCount
      }
    );
  }

  addFD(fdParmIn: any) {
    // adds one row to formatDetailArray0 from xl snippet
    this.selectedFD = new FormatDetail;
    this.selectedFD.id = null;
    let fdXLsplit = fdParmIn.toString().split(',');
    this.selectedFD.fdFormatKey = fdXLsplit[0];
    this.selectedFD.fdRow = fdXLsplit[1];
    this.selectedFD.fdRowSlot = fdXLsplit[2];
    this.selectedFD.fdContentName = fdXLsplit[3];
    this.selectedFD.fdFilterInOut = 'init';
    this.selectedFD.fdMask = fdXLsplit[4];
    let q: string = fdXLsplit[4].replace('""', ''); // kill double double quotes
    this.selectedFD.fdMask = q;
    let r: string = this.selectedFD.fdMask.split('^').join(',');
    this.selectedFD.fdMask = r;
    this.formatDetailArray0.push(
      {
        id: this.selectedFD.id,
        fdFormatKey: this.selectedFD.fdFormatKey,
        fdRow: this.selectedFD.fdRow,
        fdRowSlot: this.selectedFD.fdRowSlot,
        fdContentName: this.selectedFD.fdContentName,
        fdMask: this.selectedFD.fdMask,
        fdFilterInOut: this.selectedFD.fdFilterInOut
      }
    );
  }
  addSF(sfParmIn: any) {
    // adds one row to skuFormatArray0 from xl snippet
    this.sf = new SkuFormat;
    this.sf.id = null;
    let fdXLsplit = sfParmIn.toString().split(',');

    this.sf.sfSku = fdXLsplit[0];
    this.sf.sfLayer = fdXLsplit[1];
    this.sf.sfFormatKey = fdXLsplit[2];

    this.skuFormatArray0.push(
      {
        id: this.sf.id,
        sfFormatKey: this.sf.sfFormatKey,
        sfSku: this.sf.sfSku,
        sfLayer: this.sf.sfLayer,
        sfFilterInOut: 'init'
      }
    );
  }
  addMT(mtParmIn: any) {
    // adds one row to array from xl snippet
    this.mt = new MaskAndText;
    this.mt.id = null;
    let fdXLsplit = mtParmIn.toString().split(',');
    let mOrT = 'm';
    if (fdXLsplit[0] == 'Literal') {
      mOrT = 't';
    }
    let q: string = fdXLsplit[0].replace('""', '');
    // this.mt.mtContent = 'content: ' + q;
    this.mt.mtContent = q;
    // this.mt.mtContent = 'content: ' + fdXLsplit[0];
    // this.mt.mtMaskOrText = x + fdXLsplit[1];
    this.mt.mtMaskOrText = fdXLsplit[1];
    // Jan2019 xl has caret now, so replace with comma
    let r: string = this.mt.mtMaskOrText.split('^').join(',');
    this.mt.mtMaskOrText = r;
    this.maskAndTextArray0.push(
      {
        id: this.mt.id,
        mtMaskOrText: this.mt.mtMaskOrText,
        mtContent: this.mt.mtContent,
        mtMorT: mOrT
      }
    );
  }

  dragEnd2(ccParmIn: ContentChoice) {
    // -alert('running dragEnd2');
    // -alert(event); //this is a MouseEvent. 'event' is built in.
    this.whatCcIamDragging = ccParmIn;  // aha !!!
    // console.log(event); //interesting but not really helpful
  }

  onDrop10(pgParmIn: ProductGridListItem) {
    // -alert('running Drop10');

    // first, blank out the help msgs and the help msg arrows
    this.dragHelpMsg = '';
    this.dragHelpOn = false;
    this.whatPgIamDropping = pgParmIn;
    this.setPg1fromDropCC();
    // remove this cc from pg0 if he dropped into pg0 earlier.
    // -alert('pg -- ' + pgParmIn.pgContentName);
    let cn: string = pgParmIn.pgContentName;
    if (cn !== 'Literal') {
      // -alert('bingozi')
      let i =
        this.productGridArray0
         .findIndex(x => x.pgContentName == pgParmIn.pgContentName);
      // splice magically updates this.productGridArray0
      if (i > -1) {
      const zzz = this.productGridArray0.splice(i, 1);
      }
    }
    this.dfFilter();
  }

  setPg1fromDropCC() {
    // -alert('running setPgfromDropCC');
    // take attributes from whatIamDragging
    // and set some values in the product grid list item.
    // which pg Item should I update?  the one in whatPgIamDropping
    this.whatPgIamDropping.pgContentId = this.whatCcIamDragging.id;
    this.whatPgIamDropping.pgContentName = this.whatCcIamDragging.contentName;
    this.whatPgIamDropping.pgContentShow = this.whatCcIamDragging.contentName;
    this.whatPgIamDropping.pgContentType = this.whatCcIamDragging.contentType;
    this.whatPgIamDropping.pgMask = this.whatCcIamDragging.contentMask;
    // find and update one pg of the pg array.
    let i;
    for (i = 0; i < this.productGridArray1.length; i++) {
      this.selectedPg1 = this.productGridArray1[i];
      if (
        this.selectedPg1.pgRow == this.whatPgIamDropping.pgRow
        && this.selectedPg1.pgRowSlot == this.whatPgIamDropping.pgRowSlot) {
        this.productGridArray1[i].pgContentName = this.whatPgIamDropping.pgContentName;
        this.productGridArray1[i].pgContentShow = this.whatPgIamDropping.pgContentShow;
        this.chgPgItem(this.selectedPg1);
        break;
      }
    }
  }

  onDrop20() {
    // -alert('running onDrop20');
    // dropping a cc into the pg grid array 0 (pg-hdr)
    // -alert(this.whatCcIamDragging.contentName);
    // first, blank out the help msg and the help msg arrow
    this.dragHelpMsg = '';
    this.dragHelpOn = false;
    
    let i =
      this.productGridArray1.findIndex(x => x.pgContentName == this.whatCcIamDragging.contentName);
    this.setPg0fromDropCC();
    this.dfFilter();
  }

  setPg0fromDropCC() {
    // -alert('running setPg0fromDropCC');    
    // take attributes from whatCcIamDragging
    // and set some values in the product grid 0
    // insert a row into pg0 for the selected CC
    // pg0 has one row per CC that is dropped into pg0
    if (this.whatCcIamDragging.contentType != 'lit') {
      let i =
        this.productGridArray0
          .findIndex(x => x.pgContentName == this.whatCcIamDragging.contentName);
      if (i != -1) { return } // he already put this cc in pg0. get out.
    }
    // -alert('dragging--' + this.whatCcIamDragging.contentName);
    let newId = this.productGridArray0.length + 11;

    this.productGridArray0.push(
      {
        id: newId,
        pgRow: 0,
        pgRowSlot: 0,
        pgContentId: this.whatCcIamDragging.id,
        pgContentName: this.whatCcIamDragging.contentName,
        pgContentShow: this.whatCcIamDragging.contentName,
        pgContentType: this.whatCcIamDragging.contentType,
        pgMask: this.whatCcIamDragging.contentMask
      }
    );
    this.litInputName.nativeElement.value = ''; // give him blank input spot
    if (newId == 11) { this.pg0HelpMsg = ''; }
  }
  onPg0ContainerRightClick() {
    // -alert('on pg container right click');
    this.productGridArray0 = [];
    this.dfFilter();
    return false; // nicely disables the browswer context menu.
  }

  promptLitInput(pgParmIn: ProductGridListItem) {
    // -alert ('running promptLitInput'); // Feb2019  
    this.pgLitInput = pgParmIn.pgMask;
    this.pgIdSave.nativeElement.value = pgParmIn.id.toString();
    // make literal input area visible via plHide
    this.plHide = false;
    // delay setting litInputName focus until sleeper runa a promise.
    // otherwise the cursor won't appear in the input field.
    this.litInputName.nativeElement.value = pgParmIn.pgMask;
    // document.getElementById('abc').focus();//nativeElement instead
    this.sleeper1(5).then(
      () => this.litInputName.nativeElement.focus() ,
      () => console.log("Task Error promptLitInput")
    );
    // after he enters some literal input,the other func will use it.

  }
  litInputFocusOut(litInputParmIn:  HTMLInputElement) {
    // -alert ('running litInputFocusOut')
    // close the lit input area when he clicks outside it.
    // fake it like he hit the OK button,
    // but don't fake the OK button if he hit the cancel button.
    // this is hackish. sorry, but dom events need delay.
    this.sleeper1(5).then(    // a promise with a short delay
      () => this.litInputFocusOutB(litInputParmIn) ,
      () => console.log("Task Errored!")
    ) ;
  }
  litInputFocusOutB(litInputParmIn:  HTMLInputElement) {
    if (document.activeElement.id != 'plCan') {
      // fake it like he hit the OK button:
      this.okButLitInput(litInputParmIn) ;
    }
  }
  okButLitInput(litInputParmIn:  HTMLInputElement) {
    // take his literal input and apply it to the pg
    // that prompted for his input in the first place.
    // lots of work here just to remember and retrieve
    // which PG he clicked on to kick off the prompt.
    // we rely on a stupid hack where we save pg Id
    // to a hidden html element. i'm puzzled why selectedPGx
    // isnt remembered by the time you hit this func.
    // also, note usage here of nativeElement and html # angular:
    // litInput and pgIdSave
    // and quirky angular needs these to be an 'input' html tag.
    // also, id means the datakey here, not the elementId.
    // -alert('running setLitInput')
    let pgId = this.pgIdSave.nativeElement.value ;
    if (!this.digits_only(pgId)) { return; }
    let pgKey: number = parseInt(pgId, 10);
    let pg0Or1 = this.pg0Or1Save.nativeElement.value ;
    this.pgLitInput = litInputParmIn
      .value
      .replace('*', '')
      .replace('*', '')
    if (pg0Or1 == 'pg0') { this.setPg0FromLitInput(pgKey)};
    if (pg0Or1 == 'pg1') { this.setPg1FromLitInput(pgKey)};
    this.plHide = true;
    this.dfFilter();
  }
  setPg0FromLitInput(pgKeyParmIn) {
    let i = this.productGridArray0.findIndex(x => x.id == pgKeyParmIn );
    if (i == -1) { return; }
    this.selectedPg0 = this.productGridArray0[i];
    if (this.pgLitInput == null || this.pgLitInput == '') {
        // bango
    } else {
        this.selectedPg0.pgMask = this.pgLitInput; // mask is either mask or literal text
        this.selectedPg0.pgContentShow = 'Literal:' + this.pgLitInput;
    }
  }

  setPg1FromLitInput(pgKeyParmIn) {
    let i = this.productGridArray1.findIndex(x => x.id == pgKeyParmIn );
    if (i == -1) { return; }
    this.selectedPg1 = this.productGridArray1[i];
    if (this.pgLitInput == null || this.pgLitInput == '') {
        // bango
    } else {
        this.selectedPg1.pgMask = this.pgLitInput; // mask is either mask or literal text
        this.selectedPg1.pgContentShow = 'Literal:' + this.pgLitInput;
    }
  }

  canButLitInput(litInputParmIn:  HTMLInputElement) {
    let pgId = this.pgIdSave.nativeElement.value ;
    let pg0Or1 = this.pg0Or1Save.nativeElement.value ;
    if (!this.digits_only(pgId)) { return; }
    let pgKey: number = parseInt(pgId, 10);
    if (pg0Or1 == 'pg0') {this.canButLitMaskInput0(pgKey)}
    if (pg0Or1 == 'pg1') {this.canButLitMaskInput1(pgKey)}
    this.plHide = true;
    this.dfFilter();
  }

canButLitMaskInput0(pgKeyParmIn) {
  let i = this.productGridArray0.findIndex(x => x.id == pgKeyParmIn );
  if (i == -1) { return; }
  this.selectedPg0 = this.productGridArray0[i];
  let magicRemover = // splice magically updates this.productGridArray0
  this.productGridArray0.splice(i, 1);
}
canButLitMaskInput1(pgKeyParmIn) {
  let i = this.productGridArray1.findIndex(x => x.id == pgKeyParmIn );
  if (i == -1) { return; }
  this.selectedPg1 = this.productGridArray1[i];
  this.delPgItem(this.selectedPg1);  //blanks out one of the 16 pg1
}
maskInputFocusIn() {
  this.showMaskDropDownYn = true;
}
promptMaskInput(pgParmIn: ProductGridListItem) {
  // -alert ('running promptMaskInput'); // Mar 14 2019
  // pmHide is for mask input, OK, Cancel buttons.
  // pmmHide is a subset, just for mask input.
  this.pmHide = false; // make input area visible
  this.pmmHide = false; // make mask input visible, might change below
  // set  drop down array list  -- either lot formats or date formats:
  var x: string = pgParmIn.pgContentName + ' '; // weird bug needs ' '
  if (x.indexOf('Date') > -1) {
    this.formatMaskArrayLotsOrDates = this.formatMaskArrayDates;
  } else {
    if (x.indexOf('Lot') > -1 && x.indexOf('Cust') == -1) {
      this.formatMaskArrayLotsOrDates = this.formatMaskArrayLots;
    } else {
        this.formatMaskArrayLotsOrDates = [];
        this.pmmHide = true; // there is no mask for this one.
    }
  }
  this.pgMaskInput = pgParmIn.pgMask;
  this.pgIdSave.nativeElement.value = pgParmIn.id.toString();
  // delay setting maskInputName focus until sleeper runs a promise.
  // otherwise the cursor won't appear in the input field.
  this.maskInputName.nativeElement.value = pgParmIn.pgMask;
  this.sleeper1(5).then(
        () => this.maskInputName.nativeElement.focus() ,
        () => console.log("Task Error promptMaskInput")
      );
  // after he enters some mask input,the other func will use it.
}

okButMaskInput(maskInputParmIn:  HTMLInputElement) {
  // take his mask input and apply it to the pg
  // that prompted for his input in the first place.
  // lots of work here just to remember and retrieve
  // which PG he clicked on to kick off the prompt.
  // we rely on a stupid hack where we save pg Id
  // to a hidden html element. i'm puzzled why selectedPGx
  // isnt remembered by the time you hit this func.
  // also, note usage here of nativeElement and html # angular:
  // maskInput and pgIdSave
  // and quirky angular needs these to be an 'input' html tag.
  // also, id means the datakey here, not the elementId.
  let pgId = this.pgIdSave.nativeElement.value ;
  if (!this.digits_only(pgId)) { return; }
  let pgKey: number = parseInt(pgId, 10);
  let pg0Or1 = this.pg0Or1Save.nativeElement.value ;
  this.pgMaskInput = maskInputParmIn.value;
  if (pg0Or1 == 'pg0') { this.setPg0FromMaskInput(pgKey)};
  if (pg0Or1 == 'pg1') { this.setPg1FromMaskInput(pgKey)};
  this.pmHide = true;
  this.dfFilter();
}
setPg0FromMaskInput(pgKeyParmIn) {
  let i = this.productGridArray0.findIndex(x => x.id == pgKeyParmIn );
  if (i == -1) { return; }
  this.selectedPg0 = this.productGridArray0[i];
  if (this.pgMaskInput == null || this.pgMaskInput == '') {
      // bango
  } else {
      this.selectedPg0.pgMask = this.pgMaskInput.toUpperCase(); // mask is either mask or literal text
      this.selectedPg0.pgContentShow =
        this.selectedPg0.pgContentName + ':' + this.selectedPg0.pgMask;
  }
}
setPg1FromMaskInput(pgKeyParmIn) {
  let i = this.productGridArray1.findIndex(x => x.id == pgKeyParmIn );
  if (i == -1) { return; }
  this.selectedPg1 = this.productGridArray1[i];
  if (this.pgMaskInput == null || this.pgMaskInput == '') {
      // bango
  } else {
      this.selectedPg1.pgMask = this.pgMaskInput.toUpperCase(); // mask is either mask or literal text
      this.selectedPg1.pgContentShow =
        this.selectedPg1.pgContentName + ':' + this.selectedPg1.pgMask;
  }
}
canButMaskInput(maskInputParmIn:  HTMLInputElement) {
  let pgId = this.pgIdSave.nativeElement.value ;
  let pg0Or1 = this.pg0Or1Save.nativeElement.value ;
  if (!this.digits_only(pgId)) { return; }
  let pgKey: number = parseInt(pgId, 10);
  if (pg0Or1 == 'pg0') {this.canButLitMaskInput0(pgKey)}
  if (pg0Or1 == 'pg1') {this.canButLitMaskInput1(pgKey)}
  this.pmHide = true;
  this.dfFilter();
}

// old stuff for pg mask using javascript prompt.
// amazing this is only a few lines of code,
// but doing it with an html input area
// is tons of tricky html and javascript.
// setPgMask(pgParmIn) {
//   // -alert('set pg mask');
//   let hisMaskInput = pgParmIn.pgMask;
//   hisMaskInput = prompt('Masky:', hisMaskInput);
//   if ( hisMaskInput ) {
//     hisMaskInput = hisMaskInput.toUpperCase();
//     pgParmIn.pgMask = hisMaskInput;
//   }
// }

  onPg1RightClick(pgParmIn: ProductGridListItem) {
    // -alert('running onPg1RightClick');
    // see  html for how this func is called.    
    this.delPgItem(pgParmIn);
    this.dfFilter();
    return false; //  nicely kills browser default contextmenu!
  }
  onPg0Click(pgParmIn: ProductGridListItem ) {
    this.pg0Or1Save.nativeElement.value = 'pg0';
    this.onPgClick(pgParmIn);
  }
  onPg1Click(pgParmIn: ProductGridListItem ) {
    this.pg0Or1Save.nativeElement.value = 'pg1';
    this.onPgClick(pgParmIn);
  }
  onPgClick(pgParmIn: ProductGridListItem ) {
    // user can set the literal to real text.
    // like he might want the literal 'Mfg:'
    // that preceeds the content field MfgDate
    // alert('onPgClick')
    // alert(this.latestTarget.classList)
    if (pgParmIn.pgContentType === 'lit') {
      this.promptLitInput(pgParmIn);
    }
    if (pgParmIn.pgContentType === 'jwf') {
      this.promptMaskInput(pgParmIn);
    }
  }

  initDfFilt() {
    // -alert('running initDfFilt');  // initialize df filt
    let i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];
      this.dateCodeFormatArray0[i].dfFilterInOut = 'init';
    }
  }
  initFdFilt() {
   // -alert('running initFdFilt');
  this.formatDetailArray0.map( fd => {
    fd.fdFilterInOut = 'init';
    return fd;
  } );
  // -alert(JSON.stringify(this.formatDetailArray0));
  }

  initSfFilt() {
    this.skuFormatArray0.map( sf => {
      sf.sfFilterInOut = 'init';
      return sf;
    } );
  }
  setAllDfIn() {
    // -alert('running setAllDfIn');  // set all df to in.
    // could probably do a cool .map thing here, instead of a loop.
    let i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];
      this.dateCodeFormatArray0[i].dfFilterInOut = 'in';
    }
  }
  countPg1() {
    // how many pg entries have something real in them (as opposed to ----------)
    let x = this.productGridArray1.filter(rrr => rrr.pgContentName != '----------');
    let y = x.length;
    return y;
  }
  countPg0() {
    // how many pg0 entries are there ?
    let x = this.productGridArray0.length;
    return x;
  }
  dfCountFmtUsage() {
    // alert('running dfCountFmtUsage')
    this.dfFreqArray0 = [];
    // count how many item/layer/format recs exist for each  Fmt Nbr:

    let dfFreq = this.skuFormatArray0
      .map(({ sfFormatKey }) => sfFormatKey)
      .reduce((formats, sfFormatKey) => {
        const countThem = formats[sfFormatKey] || 0;
        formats[sfFormatKey] = countThem + 1;
        return formats;
      }, {});
      //alert( JSON.stringify(dfFreq, null, 4));

      Object.entries(dfFreq).forEach(entry => {
        // dfFreq is an array that contains a set of key & val
        let myKey = entry[0];                // the format nbr key
        let myVal: number = Number(entry[1]); // the count of this df
        this.dfFreqArray0.push(
          {
            formatNumber: myKey,
            formatUsageCount: myVal
          }
        );
      }); // end of Object.entries loop
          // set formatUsageCount for all rows in formatDetailArray0
    for (let i = 0; i < this.dateCodeFormatArray0.length; i++) {
      let k = this.dfFreqArray0
        .findIndex(x => x.formatNumber == this.dateCodeFormatArray0[i].dfFormatKey);
      this.dateCodeFormatArray0[i].dfUsageCount =
        this.dfFreqArray0[k].formatUsageCount;
    } // end of formatDetailArray0 loop

  }
  /////////////////////////////////////////////////////////////////
  accTog2(idParmIn) {
    this.dfHelpMsg = ''; // blank out the initial df  help message
    switch (idParmIn) {
      case 'df':
        if ( this.dfListOn ) {
          this.dfListOn = false;
          this.ccOn = true;
          this.pgOn = true;
          this.dpOn = false;
          this.ccDivHead = 'Content';
          this.pgDivHead = 'Product Grid';
        } else {
          this.dfListOn = true; }
        break;
      case 'sc':
        if ( this.scListOn ) {
          this.scListOn = false;
        } else {
          this.scListOn = true; }
        break;
      case 'sf':
        if ( this.sfListOn ) {
          this.sfListOn = false;
        } else {
          this.sfListOn = true; }
        break;
      case 'fd':
        if ( this.fdListOn ) {
          this.fdListOn = false;
        } else {
          this.fdListOn = true; }
        break;
      case 'fl':
        if ( this.flListOn ) {
          this.flListOn = false;
        } else {
          this.flListOn = true; }
        break;
      case 'fm':
        if ( this.fmListOn ) {
          this.fmListOn = false;
        } else {
          this.fmListOn = true; }
        break;

    }


  }
  /////////////////////////////////////////////////////////////////
  dfFilter() {
    // -alert('running dfFilter');
    // build and filter the right-side lists (the DF section)
    // this func is called when user changed something for filtering,
    // either adding to pg0 or pg1 -or- removing from pg0 or pg1. or he typed item search.
    // run dfFilterFun3 to filter pg1
    // run dfFilterBum3 to filter pg0
    // run dfFilterGum3 to filter df0 item search
    // then filter the other right-side lists,
    // like the sf sd mask text.

    this.initDfFilt(); // set all df0 filt to 'init'
    this.initFdFilt(); // set all fd0 filt to 'init'
    this.initSfFilt(); // set all sf0 filt to 'init'
    if (this.countPg0() > 0) { this.dfFilterBum3(); }
    if (this.countPg1() > 0) { this.dfFilterFun3(); }

    if (this.itemToSearchFor.trim().length !== 0) {
      this.matchSfItem(this.itemToSearchFor);
      this.dfFilterGum3();
    }
    // if he removed all filtering then setAllDfIn();
    if (this.countPg0() === 0
      && this.countPg1() === 0
      && this.itemToSearchFor.trim().length === 0) { this.setAllDfIn(); }
    // else 
    //     { this.setDfFilterInOut();  }

    // count usage of each format into df array0
    this.dfCountFmtUsage();

    // create df array1 based on df array0 filter in/out
    this.dateCodeFormatArray1 =
      this.dateCodeFormatArray0
        .filter(rrr => rrr.dfFilterInOut !== 'out');
        this.dfCount = this.dateCodeFormatArray1.length;

    // set all sf skuFormatArray0 to filter in/out
    this.sfFilter();  // ? still needed ?

    this.skuFormatArray1 =
      this.skuFormatArray0
        .filter(rrr => rrr.sfFilterInOut !== 'out');
    this.sfCount = this.skuFormatArray1.length;
    this.sfSort();

    // run filters
    // on the various right-side format lists
    // -alert('running three more filters at end of dfFilter');

    this.ccCount();
    this.ccSort();
    this.suBuild();
    this.fdFilter();
    this.flBuild();
    this.flSort();
    this.fmBuild();

    this.formatDetailArray1 =
      this.formatDetailArray0.filter(rrr => rrr.fdFilterInOut !== 'out');
    this.fdCount = this.formatDetailArray1.length;

    this.flFilter();
    this.fmFilter();

    this.formatLiteralArray1 =
      this.formatLiteralArray0.filter(rrr => rrr.flFilterInOut !== 'out');
    this.flCount = this.formatLiteralArray1.length;

    this.formatMaskArray1 =
      this.formatMaskArray0.filter(rrr => rrr.fmFilterInOut !== 'out');
    this.fmCount = this.formatMaskArray1.length;

    // set drop down list for Lot Number masks:
    this.formatMaskArrayLots =
      this.formatMaskArray0.filter(mmm => mmm.fmMaskType == 'Lot Number');

      // set drop down list for Date masks:
    this.formatMaskArrayDates =
      this.formatMaskArray0.filter(mmm => mmm.fmMaskType == 'Date');

    this.cdr.markForCheck();

    // ///////////////////////////
    // set message:
    if (this.firstScreenYN === 'Y') {
      this.firstScreenYN = 'N';
    } else {
      this.mainMsg = 'Found ' + this.dfCount + ' matching formats.';
      this.helpMsg = '';
    }

  }
  /////////////////////////////////////////////////////////////////
  // setDfFilterInOut() {
  //   // look at the df entries, and decide to set dfFilter to 'in'
  //   -alert('running setDfFilterInOut');
  //   for (let i  = 0; i < this.dateCodeFormatArray0.length; i++) {
  //     this.selectedDF = this.dateCodeFormatArray0[i];
  //     if  ( this.selectedDF.dfFilterInOut.indexOf('match') >= 0
  //         ||  this.selectedDF.dfFilterInOut.indexOf('in') >= 0   )
  //        { this.selectedDF.dfFilterInOut = 'in'; }
  //      else
  //        { this.selectedDF.dfFilterInOut = 'out'; }
  //     this.chgDFItem(this.selectedDF);
  //   }
  // }

  /////////////////////////////////////////////////////////////////
  dfFilterFun3() {
    // -alert('running dfFilterFun3');

    // loop thru df. for each df loop thru pg.
    // for each pg, look thru fd for a match on formatkey + row + slot + cc
    let fdMatchAllYN = '-';
    let i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];
      if (this.selectedDF.dfFilterInOut !== 'out') {
        // -alert('fun3 df0 -- ' + this.selectedDF.dfFilterInOut);
        fdMatchAllYN = this.dfFilterFun3b(this.selectedDF);
        if (fdMatchAllYN == 'y') {
          this.selectedDF.dfFilterInOut = 'pg1match';
          this.chgDFItem(this.selectedDF);
        }
      }
    } // end of df loop

    // done with df pg fd match, some df are currently set to pg1match.
    // take all those df pg1match's and set to 'pg12match' 
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];
      if (this.selectedDF.dfFilterInOut == 'pg1match') { 
        this.selectedDF.dfFilterInOut = 'pg12match'; 
      } else { this.selectedDF.dfFilterInOut = 'out'; } 
      this.chgDFItem(this.selectedDF);
    }
  }
  ///////////////////////////////////////////////
  dfFilterFun3b(dfParmIn: DcFormatListItem) {
    // loop thru pg
    // -alert('running dfFilterFun3b');
    let fdMatchYN = '-';
    let fdMatchAllYN = '-';
    let pgAllEmptyYN = 'y';
    let i;
    for (i = 0; i < this.productGridArray1.length; i++) {
      this.selectedPg1 = this.productGridArray1[i];
      if (this.selectedPg1.pgContentName != '----------') {
        pgAllEmptyYN = 'n'; // there is at least one non-blank pg
        fdMatchYN = this.dfFilterFun3c(this.selectedPg1, this.selectedDF);
        if (fdMatchYN != 'y') {  // this pg does not have a matching fd
          fdMatchAllYN = 'n';
          // -alert('no matching fd for this pg. jumping out of fun3b');
          return fdMatchAllYN;
        }
      }
    } // end of pg loop
    if (pgAllEmptyYN == 'n') {  // there was at least one non-blank PG
      fdMatchAllYN = 'y';
    }  // got all the way thru pg with no mismatch
    // -alert('end of fun3b. returning fdmatchAll of ' + fdMatchAllYN);
    return fdMatchAllYN;
  }  // end dfFilterFun3b
  /////////////////////
  dfFilterFun3c(pgParmIn: ProductGridListItem, dfParmIn: DcFormatListItem) {
    // -alert('running Fun3c');
    // -alert('this df-- ' + JSON.stringify(this.selectedDF));
    // loop thru fd, look for a match to this pg, this df.  return fdMatchYN
    let fdMatchYN = 'n';
    let maskMatchOkYN = '?';
    let i;
    for (i = 0; i < this.formatDetailArray0.length; i++) {
      this.selectedFD = this.formatDetailArray0[i];
      if (
        this.selectedFD.fdFormatKey == dfParmIn.dfFormatKey
        && this.selectedFD.fdRow == pgParmIn.pgRow
        && this.selectedFD.fdRowSlot == pgParmIn.pgRowSlot
        && this.selectedFD.fdContentName == pgParmIn.pgContentName
      ) {
        // -alert(' hit match fun3c');
        maskMatchOkYN = this.dfFilterFun3d(this.selectedFD, pgParmIn); // compare mask
        if (maskMatchOkYN == 'y') {
          fdMatchYN = 'y';
          break;
        }
      }

    } // end of fd loop
    return fdMatchYN;
  } // end of dfFilterFun3c
  //////////////////////
  dfFilterFun3d(fdParmIn: FormatDetail, pgParmIn: ProductGridListItem) {
    // Mask Match.  2 flavors: Literal and Content Mask
    // Literal is when contenType = 'lit'
    // Content Mask is when contentType = 'jwf'
    // -alert('running dfFilterFun3d');
    let mm = 'y'; // Mask Match  --- return y if mask match is OK  else return n ;
    if (pgParmIn.pgMask > ' '
      && fdParmIn.fdMask > ''
      && pgParmIn.pgContentType == 'lit'
      && fdParmIn.fdContentName == 'Literal') {
      // -alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
      // if (pgParmIn.pgMask != fdParmIn.fdMask)
      if (fdParmIn.fdMask.indexOf(pgParmIn.pgMask) == -1) // filter this out
      // -alert('setting mm to n'); //his mask input is included in fdMask
      { mm = 'n'; }
    }  // end of compare for literal

    if (pgParmIn.pgMask > ' '
      && fdParmIn.fdMask > ''
      && pgParmIn.pgContentType == 'jwf'
      && fdParmIn.fdContentName != 'Literal') {
      // -alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
      if (pgParmIn.pgMask != fdParmIn.fdMask) { mm = 'n'; }
    } // end of compare for content mask
    return mm; // end of dfFilterFun3d
  }
  ////////////////////////////////////////////////////////////////////////
  dfFilterBum3() {
    // -alert('running dfFilterBum3');
    // loop thru df. for each df loop thru pg0.
    // for each pg0, look thru fd for a match 
    // on formatkey + row + slot + cc
    let fdMatchAllYN = '-';
    let i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];
      fdMatchAllYN = this.dfFilterBum3b(this.selectedDF);
      if (fdMatchAllYN == 'y') {
        if (this.selectedDF.dfFilterInOut != 'out') {
          // only set pg0 match for df rows that are still in-the-running.
          this.selectedDF.dfFilterInOut = 'pg0match';
          this.chgDFItem(this.selectedDF);
        }
      }

    } // end of df loop
    // done with df pg0 fd match, some df are currently set to pg0Match.
    // others are currently still at 'init'.  mark these 'out'
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];
      if (this.selectedDF.dfFilterInOut !== 'pg0match') {
        this.selectedDF.dfFilterInOut = 'out';
      }
      this.chgDFItem(this.selectedDF);
    }
  }
  dfFilterBum3b(dfParmIn: DcFormatListItem) {
    // loop thru pg0
    // -alert('running dfFilterBum3b');
    let fdMatchYN = '-';
    let fdMatchAllYN = '-';
    let pg0AllEmptyYN = 'y';
    let i = 0;
    for (i = 0; i < this.productGridArray0.length; i++) {
      this.selectedPg0 = this.productGridArray0[i];
      pg0AllEmptyYN = 'n'; // there is at least one non-blank pg0
      fdMatchYN = this.dfFilterBum3c(this.selectedPg0, this.selectedDF);
      if (fdMatchYN != 'y')    // this pg0 does not have a matching fd
      {
        fdMatchAllYN = 'n';
        // -alert('no matching fd for this pg. jumping out of bum3b');
        return fdMatchAllYN;
      }
    } // end of pg0 loop
    if (pg0AllEmptyYN == 'n')  // there was at least one non-blank PG0
    { fdMatchAllYN = 'y'; }  // got all the way thru pg with no mismatch
    // -alert('end of fun3b. returning fdmatchAll of ' + fdMatchAllYN);
    return fdMatchAllYN;
  }
  dfFilterBum3c(pgParmIn: ProductGridListItem, dfParmIn: DcFormatListItem) {
    // -alert('running Bum3c');
    // loop thru fd, look for a match to this pg0, this df.  return fdMatchYN
    let fdMatchYN = 'n';
    let maskMatchOkYN = '?';
    for (let i = 0; i < this.formatDetailArray0.length; i++) {
      this.selectedFD = this.formatDetailArray0[i];
      if (
        this.selectedFD.fdFormatKey == dfParmIn.dfFormatKey
        && this.selectedFD.fdContentName == pgParmIn.pgContentName
      ) {
        maskMatchOkYN = this.dfFilterBum3d(this.selectedFD, pgParmIn); // compare mask
        if (maskMatchOkYN == 'y') {
          fdMatchYN = 'y';
          break;
        }
      }

    } // end of fd loop
    return fdMatchYN;
  }
  dfFilterBum3d(fdParmIn: FormatDetail, pgParmIn: ProductGridListItem) {
    // Mask Match.  2 flavors: Literal and Content Mask
    // Literal is when contenType = 'lit'
    // Content Mask is when contentType = 'jwf'
    // -alert('running dfFilterBum3d');
    let mm = 'y';     // Mask Match  --- return y if mask match is OK  else return n ;
    if (pgParmIn.pgMask > ' '
      && fdParmIn.fdMask > ''
      && pgParmIn.pgContentType == 'lit'
      && fdParmIn.fdContentName == 'Literal') {
      // -alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
      // if (pgParmIn.pgMask != fdParmIn.fdMask)

      if (fdParmIn.fdMask.indexOf(pgParmIn.pgMask) != -1)// filter this in
      { }
      else { mm = 'n' }
    }  // end of compare for literal

    if (pgParmIn.pgMask > ' '
      && fdParmIn.fdMask > ''
      && pgParmIn.pgContentType == 'jwf'
      && fdParmIn.fdContentName != 'Literal') {
      // -alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
      if (pgParmIn.pgMask != fdParmIn.fdMask) { mm = 'n'; }
    } // end of compare for content mask
    return mm; // end of dfFilterBUm3d
  }
  ////////////////////////////////////////////////////////////////////////
  dfFilterGum3() {
    // -alert('running dfFilterGum3');
    // run Gum3 func to filter df0 by item
    // -alert(JSON.stringify(this.skuFormatArray0));

    // df filter was set to init at the start
    // fun3 and bum3 set df0 filter to 'pgmatch' or 'out'
    // df0  prev set to  'pgmatch' or 'init' or 'out'
    // sf0 prev set to  'skuMatch' or 'init' or 'out'
    // compare df to sf, looking at item nbr
    // and set df filter to 'out' when there is no item match.
    // lets set sf filter to match or miss?? depending on whether df is in the sf list.
    // df has a format key and sf has a format key. match on that??
    // -alert('GUM3  df0' + JSON.stringify(this.dateCodeFormatArray0));

    let i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];
      if (this.selectedDF.dfFilterInOut.indexOf('out') === -1) {
        // this df0 is not yet 'out'
        // compare this df0 with the list of sf0
        // might set df0 filterInOut to 'dfSfMatch'
        this.filterGum3b(this.selectedDF);
      }
    } // end of df loop1

    let j; // loop2
    for (j = 0; j < this.dateCodeFormatArray0.length; j++) {
      this.selectedDF = this.dateCodeFormatArray0[j];
      if (this.selectedDF.dfFilterInOut.indexOf('dfSfMatch') === -1) {
        // df0 sf0 item nbr duznt match.
        this.selectedDF.dfFilterInOut = 'out';
        this.chgDFItem(this.selectedDF);
      }
    } // end of df loop2
  }

  filterGum3b(dfParmIn: DcFormatListItem) {
    // -alert('running filterGum3b');
    // skuFormatArray0 was set to 'skuMatch'
    // this func may set a single df0 to 'dfSfMatch'.
    for (let i = 0; i < this.skuFormatArray0.length; i++) {
      this.sf = this.skuFormatArray0[i];
      if (dfParmIn.dfFormatKey === this.sf.sfFormatKey
        && this.sf.sfFilterInOut !== 'out') {
        dfParmIn.dfFilterInOut = 'dfSfMatch';
        this.chgDFItem(dfParmIn);
        break;
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////
  // fdSelect1(dfParmIn: DcFormatListItem) {
  //   // shrink the fd list to  include
  //   // only the fd's that match the selected df formatkey
  //   this.formatDetailArray1 = this.formatDetailArray0.filter(rrr => rrr.fdFormatKey == dfParmIn.dfFormatKey);
  // }

  fdCompose(dfParmIn: DcFormatListItem) {
    // -alert('running fdCompose');
    // build a nice set-of-lines of format info from the current df and its fd's.
    // compose up to nine lines (one line per row).  compose into fc.
    // set formatDetailArray2 as a subset of fd0
    this.formatDetailArray2 = this.formatDetailArray0
      .filter(fd => fd.fdFormatKey === dfParmIn.dfFormatKey);
      // -alert('compose fd2 is' + JSON.stringify(this.formatDetailArray2));
    this.initFc0();
    // this.formatComposeArray1 = this.formatComposeArray0 ;  //duzt work?
    for (let i = 0; i < this.formatDetailArray2.length; i++) {  // fd loop
      // for the current fd, append to one fc
      this.selectedFD = this.formatDetailArray2[i];
      let k = this.formatComposeArray0.findIndex(x => x.fcRow == this.selectedFD.fdRow);
      this.fc = this.formatComposeArray0[k];
      this.fdComposeMask(this.selectedFD);   // sets fcPart1  fcPart2  fcPart3
    }
    this.formatComposeArray0 = this.formatComposeArray0.filter(sss => sss.fcPart1 > ' ' );
  }
  fdComposeMask(fdParmIn) {
    // sets fcPart1 fcPart2
    // -alert(this.selectedFD.fdMask);

    if (fdParmIn.fdContentName == 'Literal') {
      let x = fdParmIn.fdMask.replace('""', '');
      this.fc.fcPart1 = this.fc.fcPart1 + x + ' ';
      this.fc.fcPart2 = this.fc.fcPart2 + x + ' ';
      this.fc.fcContentOrText = 't';
    } else {
      this.fc.fcPart1 = this.fc.fcPart1 + fdParmIn.fdContentName + ' ';
      this.fc.fcPart2 = this.fc.fcPart2 + this.fdComposeMaskEx(fdParmIn) + ' ';
      this.fc.fcContentOrText = 'c';
    }
  }
  fdComposeMaskEx(fdParmIn) {
    let ex = '';
    if (fdParmIn.fdContentName.toUpperCase().indexOf('SKU') >= 0) {
      ex = 'NF5678';
      if (this.suFreqArray0[0].sku) { // truthy.  a sku is in play.
        ex = this.fdComposeMaskSmr(fdParmIn.fdContentName, this.suFreqArray0[0].sku);
      }
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf('CUST. LOT') >= 0) {
      ex = 'ABCDEF';
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf('LOT') >= 0
      && fdParmIn.fdContentName.toUpperCase().indexOf('CUST. LOT') != 0) {
      if (fdParmIn.fdMask.toUpperCase() == 'NNNNAMCX') {
        ex = '8001ABCD';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'NNNNAMC') { // first 7 of last8
        ex = '8001ABC';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'N/A') { // full 12 ?
        ex = '2018001ABCD';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'NAMC') { // 4-7 of last 8
        ex = '1ABC';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'NAMCX') { // 4-8 of last 8
        ex = '1ABCD';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'AMC') { // 4-8 of last 8
        ex = 'ABC';
      }
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf('DATE') >= 0) {
      if (fdParmIn.fdContentName.toUpperCase().indexOf('EXP') >= 0) {
        ex = this.fdComposeDate(fdParmIn.fdMask, this.exampleExpDate);
      } else {
        ex = this.fdComposeDate(fdParmIn.fdMask, this.exampleDate);
      }
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf('QUANTITY') >= 0) {
      ex = '24';
      // pick an example that matches mask mmddyy mm.dd.yy etc
    }
    return ex;
  }
  fdComposeDate(maskParmIn, dateExampleParmIn) {
   // call this func with two parms:
   // maskParmIn (the mask that says how we want the date to be formatted)
   // dateExample (a date in ccyymmdd format)
   // return x to the caller -- a formatted date.
   let e = dateExampleParmIn;
   let m = maskParmIn.toUpperCase();
   let x = '?'; //we will return x to the caller
   let c1 = e.substring(0, 1);
   let c2 = e.substring(1, 2);
   let y1 = e.substring(2, 3);
   let y2 = e.substring(3, 4);
   let m1 = e.substring(4, 5);
   let m2 = e.substring(5, 6);
   let d1 = e.substring(6, 7);
   let d2 = e.substring(7, 8);
   if (m == 'YYYY.MM.DD') {
    x = c1 + c2 + y1 + y2 + '.' + m1 + m2 + '.' + d1 + d2;
   }
    if (m == 'YY.MM.DD') {
      x =  y1 + y2 + '.' + m1 + m2 + '.' + d1 + d2;
    }
    if (m == 'YYYY/MM/DD') {
      x = c1 + c2 + y1 + y2 + '/' + m1 + m2 + '/' + d1 + d2;
    }
    if (m == 'YYYYMMDD') {
      x = c1 + c2 + y1 + y2  + m1 + m2  + d1 + d2;
    }
    if (m == 'MMDDYY') {
      x =  m1 + m2  + d1 + d2 + y1 + y2;
    }
    if (m == 'MM/DD/YYYY') {
      x = m1 + m2 + '/' + d1 + d2 + '/' + c1 + c2 + y1 + y2;
    }
    if (m == 'MM/DD/YY') {
      x = m1 + m2 + '/' + d1 + d2 + '/' + y1 + y2;
    }
    if (m == 'DD/MM/YYYY') {
      x = d1 + d2 + '/' + m1 + m2  + '/' + c1 + c2 + y1 + y2;
    }
    if (m == 'MM/YY') {
      x =  m1 + m2  + '/' + y1 + y2;
    }
    if (m == 'MM/YYYY') {
      x = m1 + m2  + '/' + c1 + c2 + y1 + y2;
    }
    if (m == 'DD/MM/YY') {
      x = d1 + d2  + '/' + m1 + m2 + '/' + y1 + y2;
    }
    if (m == 'DD/MM/YYYY') {
      x = d1 + d2  + '/' + m1 + m2 + '/' + c1 + c2 + y1 + y2;
    }
    if (m == 'DDMMYYYY') {
      x = d1 + d2   + m1 + m2  + c1 + c2 + y1 + y2;
    }
    if (m == 'DDMMMYY') {
      x = d1 + d2 + 'JUL' + y1 + y2;
    }
    if (m == 'MMM.YY') {
      x = 'JUL' + y1 + y2;
    }
    if (m == 'MM YY') {
      x = m1 + m2 + ' ' + y1 + y2 ;
    }
    if (m == 'NM YY') {
      if (m1 == '0') {
        x =  m2 + ' ' + y1 + y2 ;
      }
      if (m1 != '0') {
        x = m1 + m2 + ' ' + y1 + y2 ;
      }
    }
    if (m == 'MM YYYY') {
      x = m1 + m2 + ' ' + c1 + c2 + y1 + y2 ;
    }
    if (m == 'YY AMM') {
      x = y1 + y2 + ' Jl';
    }
    if (m == 'DDMMYY') {
      x = d1 + d2  + m1 + m2 + y1 + y2 ;
    }
    if (m == 'YYMMDD') {
      x = y1 + y2  + m1 + m2 + d1 + d2 ;
    }
    if (m == 'YY/MM/DD') {
      x = y1 + y2 + '/' + m1 + m2 + '/' + d1 + d2 ;
    }
    if (m == 'YYYY/MM') {
      x = c1 + c2 + y1 + y2 + '/' + m1 + m2 ;
    }
    if (m == 'DDMM YYYY') {
      x = d1 + d2 + m1 + m2 + ' ' + c1 + c2 + y1 + y2;
    }

   return x;
  }
  fdComposeMaskSmr(ccNameParmIn, skuParmIn) {
    // smr is Sku Minus Revision
    // strip the sku suffix from the right side of the sku
    // return the left side to the caller
    // note that we want to include left side alpha's,
    // and we want to exclude right side alpha's
    // and we want to exclude any numbers on the right of a 
    // rightside alpha. geez,  lotta work for something so simple.
    // 
    // return the full sku if cc aint no SKU-MINUS-REV thing:
    if (ccNameParmIn.toUpperCase().indexOf('MINUS REV') < 0) { return skuParmIn ; }
    // we are working with a SKU-MINUS-REV
    let thisCharAlphaOrNumeric = '?';
    let endOfLeft = false;
    let smr = '';
    for (let i = 0; i < skuParmIn.length; i++) {
      let x = skuParmIn.substring(i, i + 1 );
      if ( '0123456789'.indexOf(x) >= 0  ) {thisCharAlphaOrNumeric = 'n'; }
      if ( '0123456789'.indexOf(x)  < 0  ) {thisCharAlphaOrNumeric = 'a'; }
      if ( thisCharAlphaOrNumeric == 'a' &&  i > 2 ) { endOfLeft = true;  }
      if (!endOfLeft) { smr = smr + x }
    }
    return smr;
  }
  dpBuild(dfParmIn: DcFormatListItem) {
    this.myModal1Msg2 = 'Preview lot: 2018001ABCD   Preview date: 2018/07/31';
    this.myModal1Msg1 = 'Format: ' + this.selectedDF.dfFormatKey + ' ';
    this.myModal1Msg1 = this.myModal1Msg1 + this.selectedDF.dfFormatName;
    this.dp1a = 'Format: ';
    this.dp1b = this.selectedDF.dfFormatKey;
    this.dp1c = 'Description: ';
    this.dp1d = this.selectedDF.dfFormatName;
    // this.dpHeadRight = 'Preview lot: 2018001ABCD   Preview date: 2018/07/31';
    this.dp2a = 'Preview using';
    this.dp2b = ' 2018001ABCD ';
    this.dp2c = ' July 31, 2019';
    this.dp2d = '';
  }
  // fdModal1(dfParmIn: DcFormatListItem) {
  //   // show Modal1 popup dialog.
  //   // show info for the selected df
  //   // and  lists fd's for the  selected df
  //   // -alert('running fdModal1');
  //   this.myModal1Msg2 = 'Preview lot: 2018001ABCD   Preview date: 2018/07/31';
  //   this.myModal1Msg1 = 'Format: ' + this.selectedDF.dfFormatKey + ' ';
  //   this.myModal1Msg1 = this.myModal1Msg1 + this.selectedDF.dfFormatName;

  //   // this.dpLeft1a = 'Format: ' + this.selectedDF.dfFormatKey + ' '
  //                   // +  this.selectedDF.dfFormatName;
  //   this.dpHeadRight = 'Preview lot: 2018001ABCD   Preview date: 2018/07/31';


  //   let modal1 = document.getElementById('myModal1');  // controls modal open
  //   let span = document.getElementsByClassName('closerX')[0]; // controls modal close
  //   modal1.style.display = 'blocky'; // makes modal1 visible
  //   // When the user clicks on <span> (x), close the modal
  //   modal1.onclick = function () {
  //     modal1.style.display = 'none'; // makes model1 invisible
  //   };
  //   // When the user clicks anywhere outside of the modal, close it
  //   window.onclick = function (event) {
  //     if (event.target == modal1) { modal1.style.display = 'none'; }
  //   };
  //   // end of modal1()
  // }
  // fdModal2(dfParmIn: DcFormatListItem) {
  //   // -alert('running fdModal2');
  //   this.myModal1Msg1 = 'Format: ' + this.selectedDF.dfFormatKey + ' ';
  //   this.myModal1Msg1 = this.myModal1Msg1 + this.selectedDF.dfFormatName;
  //   let modal2 = document.getElementById('myModal2');  // controls modal open
  //   let span = document.getElementsByClassName('closerX')[0]; // controls modal close
  //   modal2.style.display = 'block'; // makes modal2 visible
  //   // When the user clicks on <span> (x), close the modal
  //   modal2.onclick = function () {
  //     modal2.style.display = 'none'; // makes model2 invisible
  //   };
  //   window.onclick = function (event) {
  //     if (event.target == modal2) { modal2.style.display = 'none'; }
  //   };
  // }

  fdFilter() {
    // -alert('running fdFilter');
    // -alert(JSON.stringify(this.formatDetailArray0));
    this.formatDetailArray0 =
      this.formatDetailArray0.map(fd => {
        let i = this.dateCodeFormatArray0
          .findIndex(x => x.dfFormatKey === fd.fdFormatKey);
        if (i !== -1 && this.dateCodeFormatArray0[i].dfFilterInOut === 'out') {
          fd.fdFilterInOut = 'out';
        }
        return fd;
      });


  }

  sfFilter() {
    // -alert('running sfFilter');
    // set some sf array0 filter to: out
    // we have already filtered df array0  by cc pg drag drop.
    // loop thru all sf skuFormatArray0
    // find a df array0 entry that matches on formatkey
    // if df0 is out, then set sf filterInOut to out
    // -alert('sf0 is ' + JSON.stringify(this.skuFormatArray0));
    this.skuFormatArray0 =
      this.skuFormatArray0.map(sf => {
        let i = this.dateCodeFormatArray0.findIndex(x => x.dfFormatKey == sf.sfFormatKey);
        if (this.dateCodeFormatArray0[i].dfFilterInOut === 'out' ) {
          sf.sfFilterInOut = 'out';
        }
        return sf;
      });
    // this might be more readable if I name the function
    // that is called by map() ?
  }

  sfSort() {
    // sorts the arrary 'in place'
    // javascript sort has a weird compare function.
    // -alert('running sfSort');
    this.skuFormatArray1.sort(function (a, b) {
      if (a.sfSku < b.sfSku) {
        return -1;
      }
      if (a.sfSku > b.sfSku) {
        return 1;
      }
      return 0;
    });
  }

  flFilter() {
    // -alert('running flFilter');
    // fl 0 has one row per unique literal.
    // for each row in fl 0
    // try to find a match in in fd1.
    // fd1 has already been filtered.
    // set fl filter to out when no text match found in fd1
    this.formatLiteralArray0 =
      this.formatLiteralArray0.map(fl => {
        let i = this.formatDetailArray1
          .findIndex(x => x.fdMask === fl.flText);
        if (i === -1)  {
          fl.flFilterInOut = 'out';
        }
        return fl;
      });
      // -alert('fl 0:' + JSON.stringify(this.formatLiteralArray0) );
  }
  fmFilter() {
    // -alert('running fmFilter');
    // fm 0 has one row per unique mask. 
    // for each row in fm 0
    // try to find a match in in fd1.
    // fd1 has already been filtered.
    // set fm filter to out when no mask match found in fd1
    // also, filter out the annoying 'N/A' and (blank) .
    this.formatMaskArray0 =
      this.formatMaskArray0.map(fm => {
        let i = this.formatDetailArray1
          .findIndex(x => x.fdMask === fm.fmMask);
        if (i === -1 || fm.fmMask === 'N/A' || fm.fmMask === '(blank)')  {
          fm.fmFilterInOut = 'out';
        }
        return fm;
      });
      // -alert('fm 0:' + JSON.stringify(this.formatMaskArray0) );
  }
  ////////////////////////////////////////////////////////////////////////

  initDummyArrays() {
    this.contentChoiceArray1 = [
      { id: 11, contentName: 'Test1', contentType: 'jwf', contentMask: '', contentUsageCount: 0 },
      { id: 12, contentName: 'Test2', contentType: 'jwf', contentMask: '', contentUsageCount: 0 },
      { id: 13, contentName: 'Test3', contentType: 'jwf', contentMask: '', contentUsageCount: 0 },
      { id: 14, contentName: 'Literal', contentType: 'lit', contentMask: '', contentUsageCount: 0 },
      { id: 15, contentName: 'Run Import to Reset These', contentType: 'jwf', contentMask: '', contentUsageCount: 0 }
    ];
    this.dateCodeFormatArray0 = [
      { id: 11, dfFormatKey: '357', dfFormatName: 'lit,t1,more', dfFormatDesc: 'lit,lot,more', dfFilterInOut: 'init', dfUsageCount: 222 },
      { id: 12, dfFormatKey: '358', dfFormatName: 'lit,exp', dfFormatDesc: 'lit,exp', dfFilterInOut: 'init', dfUsageCount: 222 },
      { id: 13, dfFormatKey: '359', dfFormatName: 'lit,t2', dfFormatDesc: 'lit,lot', dfFilterInOut: 'init', dfUsageCount: 222 },
      { id: 14, dfFormatKey: '360', dfFormatName: 'lit,exp', dfFormatDesc: 'lit,exp', dfFilterInOut: 'out', dfUsageCount: 222 }
    ];
    this.productGridArray1 = [
      { id: 11, pgRow: 1, pgRowSlot: 1, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 12, pgRow: 1, pgRowSlot: 2, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 13, pgRow: 1, pgRowSlot: 3, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 14, pgRow: 1, pgRowSlot: 4, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 15, pgRow: 2, pgRowSlot: 1, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 16, pgRow: 2, pgRowSlot: 2, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 17, pgRow: 2, pgRowSlot: 3, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 18, pgRow: 2, pgRowSlot: 4, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 19, pgRow: 3, pgRowSlot: 1, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 20, pgRow: 3, pgRowSlot: 2, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 21, pgRow: 3, pgRowSlot: 3, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 22, pgRow: 3, pgRowSlot: 4, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 23, pgRow: 4, pgRowSlot: 1, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 24, pgRow: 4, pgRowSlot: 2, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 25, pgRow: 4, pgRowSlot: 3, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' },
      { id: 26, pgRow: 4, pgRowSlot: 4, pgMask: '', pgContentId: 0, pgContentName: '----------', pgContentType: '???', pgContentShow: '----------' }
    ];
    this.productGridArray0 = [];
    this.formatDetailArray0 = [
      { id: 111, fdRow: 1, fdRowSlot: 1, fdFormatKey: '357', fdContentName: 'Literal', fdMask: 't1:', fdFilterInOut: 'init'  },
      { id: 112, fdRow: 1, fdRowSlot: 2, fdFormatKey: '357', fdContentName: 'LotNbr', fdMask: 'NNNNAMCX', fdFilterInOut: 'init' },
      { id: 113, fdRow: 2, fdRowSlot: 1, fdFormatKey: '357', fdContentName: 'Literal', fdMask: 'mfg:', fdFilterInOut: 'init' },
      { id: 114, fdRow: 2, fdRowSlot: 2, fdFormatKey: '357', fdContentName: 'MfgDate', fdMask: 'mm/dd/yy', fdFilterInOut: 'init'},
      { id: 115, fdRow: 1, fdRowSlot: 1, fdFormatKey: '360', fdContentName: 'Literal', fdMask: 'exp:', fdFilterInOut: 'init' },
      { id: 116, fdRow: 1, fdRowSlot: 2, fdFormatKey: '360', fdContentName: 'ExpDate', fdMask: 'mm/dd/yy', fdFilterInOut: 'init' },
      { id: 117, fdRow: 1, fdRowSlot: 1, fdFormatKey: '358', fdContentName: 'Literal', fdMask: 'exp:', fdFilterInOut: 'init'},
      { id: 118, fdRow: 1, fdRowSlot: 2, fdFormatKey: '358', fdContentName: 'ExpDate', fdMask: 'mm/dd/yy', fdFilterInOut: 'init' },
      { id: 119, fdRow: 1, fdRowSlot: 1, fdFormatKey: '359', fdContentName: 'Literal', fdMask: 't1:', fdFilterInOut: 'init' },
      { id: 120, fdRow: 1, fdRowSlot: 2, fdFormatKey: '359', fdContentName: 'LotNbr', fdMask: 'NAMC', fdFilterInOut: 'init' }
    ];
    this.formatDetailArray1 = this.formatDetailArray0;
    this.skuFormatArray0 = [
      {
        id: 111,
        sfSku: 'BLA',
        sfLayer: '1',
        sfFormatKey: '357',
        sfFilterInOut: 'init'
      }
    ];
    this.skuFormatArray1 = this.skuFormatArray0;
    this.maskAndTextArray0 = [
      { id: 111, mtContent: 'Expiration Date', mtMaskOrText: 'mm/dd/yy', mtMorT: 'm' },
      { id: 112, mtContent: 'Literal', mtMaskOrText: 'exp:', mtMorT: 't' }
    ];
    this.formatLiteralArray0 = [
      { id: 111, flContent: 'Literal', flText: 'mfg:', flFilterInOut: 'init' },
      { id: 112, flContent: 'Literal', flText: 'exp:', flFilterInOut: 'init' },
      { id: 113, flContent: 'Literal', flText: 'Satinique', flFilterInOut: 'init' }
    ];
    this.formatMaskArray0 = [
      { id: 111, fmMask: 'MMDDYY'  , fmMaskType: 'date', fmFilterInOut: 'init' },
      { id: 112, fmMask: 'YYMMDD'  , fmMaskType: 'date', fmFilterInOut: 'init' },
      { id: 113, fmMask: 'YYYYMMDD', fmMaskType: 'date', fmFilterInOut: 'init' }
    ];
    this.ccFreqArray0 = [
      { contentName: 'Literal', contentUsageCount: 5 },
      { contentName: 'Test1', contentUsageCount: 4 },
      { contentName: 'Test2', contentUsageCount: 3 },
      { contentName: 'Test3', contentUsageCount: 2 },
      { contentName: 'Run Import to Reset These', contentUsageCount: 1 }
    ];
    this.suFreqArray0 = [
      { sku: 'foo123', skuUsageCount: 123, skuUsageFormats: '7 1008', skuUsageFilterInOut: 'init' },
      { sku: 'foo777', skuUsageCount: 777, skuUsageFormats: '7 1111', skuUsageFilterInOut: 'init' }
    ];
    this.initFc0();
  }
  //
  initFc0() { // used for housing df & fd values shown in format detail
    this.formatComposeArray0 = [
      { id: 1, fcRow: 1, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 2, fcRow: 2, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 3, fcRow: 3, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 4, fcRow: 4, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 5, fcRow: 5, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 6, fcRow: 6, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 7, fcRow: 7, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 8, fcRow: 8, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' },
      { id: 9, fcRow: 9, fcFormatKey: '', fcPart1: '', fcPart2: '', fcPart3: '', fcContentOrText: 'c' }
    ];
  }


  // XL import section:
  /////////////////////////////////////////////
  onHtmlInputFileChange(evt: any) {
    // -alert('running onHtmlInputFileChange');
    // ties to html <input type="file" (change)="onFileChange($event)"  />
    // only gets called when the screen 'choose files' field
    // is changed to a different filename.
    this.mainMsg = ' '; // blinker during import so use other msg area
    this.importingMsg = ' running data import... ';
    this.helpMsg = '';
    let target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files') };
    // -alert ('fall here when no error');
    // document.getElementById('xlArea1').className = 'hide-sometimes';
    this.xiOn = false;
    let reader: FileReader = new FileReader();
    // -------------------------------------------------
    reader.onload = (e: any) => {
      this.mainMsg = 'data imported. ';
      this.importingMsg = '';
      this.contentChoiceArray1 = [];
      this.dateCodeFormatArray0 = [];
      this.dateCodeFormatArray1 = [];
      this.formatDetailArray0 = [];
      this.skuFormatArray0 = [];
      this.skuFormatArray1 = [];
      this.maskAndTextArray0 = [];
      this.formatLiteralArray0 = [];
      this.formatMaskArray0 = [];
      this.ccFreqArray0 = [];
      this.dfFreqArray0 = [];
      // -alert('running reader.onload');
      // this.clearDemoArrays; stupid callback duznt call this function?
      // read workbook .  this is a callback, executed after the file read.
      let bstr: string = e.target.result;
      let wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      let wsname: string = wb.SheetNames[0]; // first worksheet  is 0 /////
      let ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.setCCfromXL(ws);
      wsname = wb.SheetNames[1];  // second worksheet  is 1 /////
      ws = wb.Sheets[wsname];
      this.setDFfromXL(ws);
      //
      wsname = wb.SheetNames[2];  // third worksheet  is 2 /////
      ws = wb.Sheets[wsname];
      this.setFDfromXL(ws);
      wsname = wb.SheetNames[3];  // fourth worksheet  is 3 /////
      ws = wb.Sheets[wsname];
      this.setSFfromXL(ws);
      wsname = wb.SheetNames[4];  // fourth worksheet  is 4 /////
      ws = wb.Sheets[wsname];
      this.setMTfromXL(ws); 
      // this.setFMfromXL(); // set fm as a subset of MT ////
      this.dfFilter();

      this.cdr.markForCheck();
      this.setCcDfLocalStorage();
    }; // end of reader.onload callback
    // --------------------------------------------------
    reader.readAsBinaryString(target.files[0]);
  } // end of onHtmlInputFileChange

  setCCfromXL(ws: XLSX.WorkSheet) {
    this.xlData = <AOA>(XLSX.utils.sheet_to_json(ws, { range: 1, header: 1 }));
    let ccGo: any;
    for (let key in this.xlData) {
      if (this.xlData.hasOwnProperty(key)) {
        ccGo = this.xlData[key];
        this.addCC(ccGo); // inserts one row into the cc table
      }
    }
  }
  setDFfromXL(ws: XLSX.WorkSheet) {
    this.xlData = <AOA>(XLSX.utils.sheet_to_json(ws, { range: 1, header: 1 }));
    let dfGo: any;
    for (let i in this.xlData) {
      if (this.xlData.hasOwnProperty(i)
        && this.xlData[i].length > 0) {
        dfGo = this.xlData[i];
        this.addDF(dfGo);  // inserts one row into the DF table
      }
    }
  }
  setFDfromXL(ws: XLSX.WorkSheet) {
    this.xlData = <AOA>(XLSX.utils.sheet_to_json(ws, { range: 1, header: 1 }));
    let fdGo: any;
    for (let i in this.xlData) {
      if (this.xlData.hasOwnProperty(i)
        && this.xlData[i].length > 0) {
        fdGo = this.xlData[i];
        this.addFD(fdGo);  // inserts one row into the FD table
      }
    }
  }
  ////////////////////////////////////
  setSFfromXL(ws: XLSX.WorkSheet) {
    this.xlData = <AOA>(XLSX.utils.sheet_to_json(ws, { range: 1, header: 1 }));
    let sfGo: any;
    for (let i in this.xlData) {
      if (this.xlData.hasOwnProperty(i)
        && this.xlData[i].length > 0) {
        sfGo = this.xlData[i];
        this.addSF(sfGo);  // inserts one row into the SF table
      }
    }
  }

  setMTfromXL(ws: XLSX.WorkSheet) {
    this.xlData = <AOA>(XLSX.utils.sheet_to_json(ws, { range: 1, header: 1 }));
    let mtGo: any;
    for (let i in this.xlData) {
      if (this.xlData.hasOwnProperty(i)
        && this.xlData[i].length > 0) {
        mtGo = this.xlData[i];
        this.addMT(mtGo);  // inserts one row into the SF table
      }
    }
  }

  onItemSearchClick() {
    // called when he hits the item search button.
    // -alert('running onItemSearchClick');
    this.itemToSearchFor = this.itemToSearchFor
      .toUpperCase()
      .trim()
      .replace('*', '')
      .replace('*', '');

    this.dfFilter(); // -apply all filters including the item filter
  }
  matchSfItem(itemParmIn: string) {
    // -alert('running searchByItem ' + itemParmIn);
    itemParmIn = itemParmIn.trim();
    this.skuFormatArray0 =
      this.skuFormatArray0.map(sf => {
        if (sf.sfSku.indexOf(itemParmIn) !== -1) {
          // this sf matches his item input 
          sf.sfFilterInOut = 'skuMatch';
        } else {
          sf.sfFilterInOut = 'out';
        }
        return sf;
      });
    // // was this:  was a bit simpler.  
    // this.skuFormatArray1 =
    //   this.skuFormatArray0
    //   .filter(sss => sss.sfSku.indexOf(itemParmIn) != -1)  ;



  }
  ////////////////////////////////////////////////////
  ccCount() {
    // -alert('running countCC');
    this.ccFreqArray0 = [];
    // count how may fd recs exist for each cc contentName:

    let ccFreq = this.formatDetailArray0
      .map(({ fdContentName }) => fdContentName)
      .reduce((names, fdContentName) => {
        const count = names[fdContentName] || 0;
        names[fdContentName] = count + 1;
        return names;
      }, {});
    // ccFreq: { "Literal":5,"LotNbr":2,"MfgDate":1,"ExpDate":2 }
    // let myJson2 = JSON.stringify(ccFreq);
    Object.entries(ccFreq).forEach(entry => {
      // ccFreq is an array that contains a set of key & val
      let myKey = entry[0];                // the contentName key
      let myVal: number = Number(entry[1]); // the count of this cc
      this.ccFreqArray0.push(
        {
          contentName: myKey,
          contentUsageCount: myVal
        }
      );
    }); // end of Object.entries loop

    // set contentUsageCount for all rows in contentChoiceArray1
    for (let i = 0; i < this.contentChoiceArray1.length; i++) {
      let k = this.ccFreqArray0
        .findIndex(x => x.contentName == this.contentChoiceArray1[i].contentName);
      this.contentChoiceArray1[i].contentUsageCount =
        this.ccFreqArray0[k].contentUsageCount;
    } // end of contentChoiceArray1 loop

    // this.contentChoiceArray1.forEach(function(cc){ ??broken??  ?why?
    //   -alert (cc.contentName) // yes, cc is a nice object now, but...
    //   k = this.ccFreqArray0.findIndex(x => x.contentName == cc.contentName);
    // }); //something wrong with this forEach trying to nest a function
    // -alert(JSON.stringify(this.ccFreqArray0) )
    //let el = document.querySelector('#listy span:nth-child(2)');
    // -alert('end of countCC');
  } // end of CountCC

  ccSort() {
    // sorts the arrary 'in place'
    // sort has a weird compare function.
    this.contentChoiceArray1.sort(function (a, b) {
      if (a.contentUsageCount < b.contentUsageCount) {
        return 1;   // -1 ascend 1 descend
      }
      if (a.contentUsageCount > b.contentUsageCount) {
        return -1;   // 1 ascend -1 descend
      }
      return 0;
    });
  }

  suBuild() {
    // count occurences of each item/layer/format
    // store the count into suFreqArray0.
    // -alert('running suBuild');
    let sfFreq = this.skuFormatArray1
      .map(({ sfSku }) => sfSku)
      .reduce((n, sfSku) => {
        const count = n[sfSku] || 0;
        n[sfSku] = count + 1;
        return n;
      }, {});
    // -alert(JSON.stringify(sfFreq) );
    this.suFreqArray0 = [];
    Object.entries(sfFreq).forEach(entry => {
      // sfFreq is an array that contains a set of key & val
      let myKey = entry[0];                // the item nbr key
      let myVal: number = Number(entry[1]); // the count of this sf
      this.suFreqArray0.push(
        {
          sku: myKey,
          skuUsageCount: myVal,
          skuUsageFormats: '???',  // set this later
          skuUsageFilterInOut: 'out'  // set this later
        }
      );
    }); // end of Object.entries loop
    this.suCount = this.suFreqArray0.length;
    this.setSuFormatList();
  }  //  end of sfCount

  mtBuild() {

  }
  flBuild() {
    // fl means Format Literal
    // set fl by using a subset of mt
    // (mt is mask+test, fl is just the text )
    // mt is already set.
    this.formatLiteralArray0 = [];
    for (let i = 0; i < this.maskAndTextArray0.length; i++) {
      if (this.maskAndTextArray0[i].mtMorT == 't') // text
      {
        // push into fl
        this.formatLiteralArray0.push(
          {
            id: 27,
            flContent: 'Literal',
            flText: this.maskAndTextArray0[i].mtMaskOrText,
            flFilterInOut: 'init'
          }
        );
      }
    }
  }
  flSort() {
        // sorts the arrary 'in place'
    // javascript sort has a weird compare function.
    // -alert('running flSort');
    this.formatLiteralArray0.sort(function (a, b) {
      if (a.flText < b.flText) {
        return -1;
      }
      if (a.flText > b.flText) {
        return 1;
      }
      return 0;
    });

  }
  fmBuild() {
    // -alert('running fmBuild');
    this.formatMaskArray0 = [];
    let maskType = '';
    // set fm by using a subset of mt  (mt is mask+text, fm is just the mask )
    for (let i = 0; i < this.maskAndTextArray0.length; i++) {
      if (this.maskAndTextArray0[i].mtMorT == 'm') {
        if (this.maskAndTextArray0[i].mtMaskOrText.indexOf('AMC') > -1) {
          maskType = 'Lot Number'; // has AMC in the mask
        } else {
          maskType = 'Date';  // must be a date
        }
        // push this mask into fm but first see if the mask already in fm0
        let j: number = this.formatMaskArray0
        .findIndex(m => m.fmMask === this.maskAndTextArray0[i].mtMaskOrText);
        if (j === -1) {
          // push into fm
          this.formatMaskArray0.push(
          {
              id: 27,
              fmMaskType: maskType,
              fmMask: this.maskAndTextArray0[i].mtMaskOrText,
              fmFilterInOut: 'init'
          } );
        }
      }
    }
  }

  setSuFormatList() {
    // there is one sku for each rec in suFreqArray0.
    // lookup all the formats used by this sku.
    // string the format codes together into skuUsageFormats
    // set FilterInOut to in when there is at least one format
    let x = '';
    for (let i = 0; i < this.suFreqArray0.length; i++) {
      x = this.setSuFormatListB(this.suFreqArray0[i].sku);
      if (x.length > 0) {
        this.suFreqArray0[i].skuUsageFilterInOut = 'in';
        this.suFreqArray0[i].skuUsageFormats = 'Formats: ' + x;
      }
    }
  }
  setSuFormatListB(skuIn) {
    // lookup all item/formats that match this item nbr
    // and append each format to fList
    // when done, fList will be a string of all the formats
    // used by this item
    let fList = '';
    for (let j = 0; j < this.skuFormatArray1.length; j++) {
      if (this.skuFormatArray1[j].sfSku == skuIn) {
        fList = fList + ' ' + this.skuFormatArray1[j].sfFormatKey;
      }
    }
    return fList;
  } // end of setSfFormatListB

  showMaskDropDown() {
    // this.showMaskDropDownYn = true;
  }
  hideMaskDropDown() {
    //this.showMaskDropDownYn = false;
  }
  onClickMaskDropDown(maskDropDownChoiceParmIn: any) {
    // -alert('onClickMaskDropDown ' + maskDropDownChoiceParmIn.maskChoiceName);
    // get here when he chose a dropdown maskDropDownChoiceParmIn
    this.pgMaskInput = maskDropDownChoiceParmIn.fmMask;
    // copy from dropdown choice into mask input field
    this.maskInputName.nativeElement.value = this.pgMaskInput;
    // fake it like he hit the OK button:
    this.okButMaskInput(this.maskInputName.nativeElement) ;
    this.showMaskDropDownYn = false;
  }

  ////////////////////////////////////////////////////
  dfRefocus(dfiParmIn, upDnParmIn) {
    // when he clicks on the dflist,
    // show dp and fd on rightside.
    // this func also provides arrow up and down on dfList.
    this.ccOn = false;
    this.pgOn = false;
    this.dpOn = true;
    this.ccDivHead = 'Format Detail';
    this.pgDivHead = 'Layout & Preview';
    let i: number = dfiParmIn;
    let niceId = '';

    if ( upDnParmIn === 'up' && dfiParmIn > 0 ) {
       niceId = 'niceId' + (dfiParmIn - 1).toString() ;
      document.activeElement.previousElementSibling
      .setAttribute('id', niceId);
      document.getElementById(niceId).focus();
      i = i - 1 ;
    }
    if ( upDnParmIn === 'dn' && dfiParmIn < this.dateCodeFormatArray1.length - 1) {
      niceId = 'niceId' + (dfiParmIn + 1).toString() ;
      document.activeElement.nextElementSibling
      .setAttribute('id', niceId);
      document.getElementById(niceId).focus();
      i = i + 1 ;
    }
    this.selectedDF = this.dateCodeFormatArray1[i];
    this.fdCompose(this.selectedDF);
    this.dpBuild(this.selectedDF);
    return false;  // does this prevent normal-browswer-scrolling?
  } //  end df refocus
  setVisitCount() {
    let n = this.dacoVisitCount + 1;
    //this.dacoVisitCountKeyName = 'dacoVisitCountKey';
    localStorage.setItem(this.dacoVisitCountKeyName, n.toString() );
  }
  getVisitCount() {
    let x = localStorage.getItem(this.dacoVisitCountKeyName);
    if (x && this.digits_only(x)) {
      this.dacoVisitCount = parseInt(x, 10) ;
    }
  }

  digits_only(strParmIn): Boolean {
    // return true if strParmIn has only digits. sortof like isNumeric()
    let arr1 = [...strParmIn] ; // spread operator makes array from string
    for ( let i = 0; i < arr1.length; i++) {
      let isNumerico = '0123456789'.includes(arr1[i]) ;
      if (!isNumerico) { return false; }
    }
   return true;
   // looks cool, but javascript complains 'every' is not a function:
   // let zooboo = arr1.every(c => '0123456789'.includes(c)); //duznt work
  }

  chkMouseClick(evtParmIn) {
    this.latestTarget = evtParmIn.target;
    this.chkMouseClickPgArea(evtParmIn)
    this.chkMouseClickMaskArea(evtParmIn)
  }
  chkMouseClickPgArea(evtParmIn) {
    // -alert('running chkMouseClickPgArea');
    // first, highlight which PG card he clicked on,
    // as he sets up the mask and clicks ok/cancel
    if (this.pgTarget
    &&  this.pgTarget != this.latestTarget)
       {
      // uncolor the previous pg he was working with
      this.pgTarget.classList.remove('pgHot') ;
    }
    let et = evtParmIn.target ;
    if (et.classList.contains('pg0Card')
    || et.classList.contains('pg1Card')) {
      // color this as pgHot to show him which pg he is working on
      this.pgTarget = evtParmIn.target ;
      this.pgTarget.classList.add('pgHot') ;
    }
    // alert(this.pgTarget.firstChild.classList)
    // if (this.pgTarget.firstChild.classList 
    // && this.pgTarget.firstChild.classList.contains('pg1CardInner')) {
    //   this.pgTarget.firstChild.classList.add('pgHot') ;
    // }
    // next, check to show cc & pg instead of layout & preview.
    // when he clicks outside the rightside fd list,
    // we want to show the original cc and pg sections.
    // this func is related to dfRefocus, where we show
    // the dp sections when he is looking at the fd list.
    // in other words, after he views the layout & preview,
    // we are giving him a way to go back to the search.
    // a mouse click wakes up this func.  Lets look at
    // what got clicked.  If he clicked outside the fd,
    // then turn on cc and pg and turn off dp
    if ( !this.dpOn ) { return ; } // layout & Preview not on, get out now
    // lookup elements, parents, grandparents of what he clicked on.
    // keep track of the class names for these ancestors.
    // if any ancestor is fdDiv, then don't toggle. geez this feels hacky.
    let ff = evtParmIn.target
    let gg = evtParmIn.target.parentElement
    let hh = evtParmIn.target.parentElement.parentElement
    let ii = evtParmIn.target.parentElement.parentElement.parentElement
    let jj = evtParmIn.target.parentElement.parentElement.parentElement.parentElement
    let kk = evtParmIn.target.parentElement.parentElement.parentElement.parentElement.parentElement
    let ffc = ''
    let ggc = ''
    let hhc = ''
    let iic = ''
    let jjc = ''
    let kkc = ''
    if (ff !== null) {ffc = ff.className}
    if (gg !== null) {ggc = gg.className}
    if (hh !== null) {hhc = hh.className}
    if (ii !== null) {iic = ii.className}
    if (jj !== null) {jjc = jj.className}
    if (kk !== null) {kkc = kk.className}
    // concat the target & parent classes so we can look at them together.
    let myClsList = ffc + '|' + ggc + '|'+ hhc + '|'+ iic + '|' + jjc + '|' + kkc  ;
    // if dfDiv or cgDp or cgFd then dont' toggle.
    if  (myClsList.indexOf('dfDiv')  != -1 ) {return}
    if  (myClsList.indexOf('cgDp')   != -1 ) {return}
    if  (myClsList.indexOf('cgFd')   != -1 ) {return}
    this.accTog2('df') ; // he clicked outside df, so toggle df
  } // end of checkTogPg

  chkMouseClickMaskArea(evtParmIn) {
  // Check if the click was inside or outside the mask element.
  // if he clicked outside the mask area, then hide the mask area.
  let ff = evtParmIn.target;
    if (ff.className.indexOf('mask') > -1 ) {
      // -alert('he clicked inside the mask Input Area ')
    } else {
       // -alert('he clicked outside the mask Input Area')
      this.pmHide = true;
    }
  }
  detectBrowser() {
    let x = navigator.userAgent.toUpperCase();
    if ( x.indexOf('EDGE') > -1 ) {
      this.whichBrowser = 'EDGE';
    }
    if ( x.indexOf('SAFARI') > -1 ) {
      this.whichBrowser = 'SAFARI';
    }
    if ( x.indexOf('CHROME') > -1 ) {
      this.whichBrowser = 'CHROME';
    }
    if (this.whichBrowser == 'CHROME'
        || this.whichBrowser == 'SAFARI') {
          // browser is OK
    } else {
        alert('Your browser is not supported. Please use Chrome or Safari.');
    }
  }
  chkNaggyHelp() {
    // if he is an experienced user, quit showing him naggy help
    // after 5 visits, don't show the big 'how to' paragraph
    // after 20 visits, don't the drag-here messages
    if (this.dacoVisitCount >= 5) { this.helpMsg = ''; }
    if (this.dacoVisitCount >= 20) {
      this.dragHelpMsg = '';
      this.dragHelpOn = false;
      this.dfHelpMsg = '';
    }
  }

//  // example promise
//  // call sleeper1 to stick in a brief delay. ( ms is millisecs)
sleeper1(ms) {
  const promise1 = new Promise((resolve1, reject) => {
    setTimeout(() => {
      // -alert('Sleeper1 Done');
      resolve1();
    }, ms);
  });
  return promise1;
}  // end sleeper1 example promise

// sleeper(ms) { some think this is cleaner but I'm confused.
// return function(x) {
//   return new Promise(resolve => setTimeout(() => resolve(x), ms));
// };
// }
onClickSetLs() {
  this.setCcDfLocalStorage();
}
setCcDfLocalStorage() {
  // -alert('running setLocal')
  let x = '';
  x =  JSON.stringify(this.contentChoiceArray1);
  localStorage.setItem('dacoCcKey', x);
  x =  JSON.stringify(this.dateCodeFormatArray0);
  localStorage.setItem('dacoDfKey', x);
  x =  JSON.stringify(this.formatDetailArray0);
  localStorage.setItem('dacoFdKey', x);
  x =  JSON.stringify(this.skuFormatArray0);
  localStorage.setItem('dacoSfKey', x);
  x =  JSON.stringify(this.maskAndTextArray0);
  localStorage.setItem('dacoMtKey', x);
}
onClickGetLs() {
  this.getCcDfLocalStorage();
  this.dfFilter();
}

getCcDfLocalStorage() {
  // -alert ('running getLocal')
  let x = '';
  x = localStorage.getItem('dacoCcKey');
  if (x) { this.contentChoiceArray1 = JSON.parse(x); }
  x = localStorage.getItem('dacoDfKey');
  if (x) { this.dateCodeFormatArray0 = JSON.parse(x); }
  x = localStorage.getItem('dacoFdKey');
  if (x) { this.formatDetailArray0 = JSON.parse(x); }
  x = localStorage.getItem('dacoSfKey');
  if (x) { this.skuFormatArray0 = JSON.parse(x); }
  x = localStorage.getItem('dacoMtKey');
  if (x) { this.maskAndTextArray0 = JSON.parse(x); }
}

} // end Export Class contentChoices
/////////////////////////////////////////////
