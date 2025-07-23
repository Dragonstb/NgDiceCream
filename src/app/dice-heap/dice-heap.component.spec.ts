import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DiceHeapComponent } from "./dice-heap.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe( 'DiceHeapComponent', () => {
    let fixture: ComponentFixture<DiceHeapComponent>;
    let heap: DiceHeapComponent;
    let heapNatElem: HTMLElement;
    let heapDbgElem: DebugElement;
    const inputFacets: number = 4;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DiceHeapComponent],
        }).compileComponents();
        
        fixture = TestBed.createComponent( DiceHeapComponent );
        fixture.autoDetectChanges();
        heap = fixture.componentInstance;
        heapNatElem = fixture.nativeElement;
        heapDbgElem = fixture.debugElement;
        fixture.componentRef.setInput( 'facets', inputFacets );
        await fixture.whenStable();
    });

    // _______________ create _______________

    it('should create the dice heap', () => {
        expect( heap ).toBeTruthy();
    });

    it('should have the correct number of facets', () => {
        expect( heap.facets ).toEqual( inputFacets );
    });

    it('should have the correct initial number of dice', () => {
        expect( heap.count ).toEqual( 1 );
    });
    
    it( 'should display the correct heap descriptor', () => {
        const title = heapNatElem.querySelector('h3')!;
        const expected = '1d'+inputFacets;
        expect( title.textContent ).toEqual( expected );
    });

    it('should have the remove die button deactivated', () => {
        const btn = heapDbgElem.query( By.css('#d'+inputFacets+'removeDieButton') );
        expect( btn.properties['disabled'] ).toBeTrue();
    });

    // _______________ changing the number of dice _______________

    it( 'should have the correct number of dice after changing the number', () => {
        const newCount = 4;
        heap.addDice( newCount - 1 ); // one die is there from the beginning on
        expect( heap.count ).toEqual( newCount );
    });

    it( 'should display the correct heap descriptor after changing the number of dice', () => {
        const newCount = 4;
        heap.addDice( newCount - 1 ); // one die is there from the beginning on
        const title = heapNatElem.querySelector('h3')!;
        const expected = newCount+'d'+inputFacets;
        fixture.detectChanges();
        expect( title.textContent ).toEqual( expected );
    });

    it( 'should fire a heap-changed event when changing the number of dice', () => {
        let fired = false;
        heap.heapChangedEvent.subscribe( () => {fired = true;} );
        heap.addDice( 3 );
        expect( fired ).toBeTrue();
    });
    
    it( 'should *not* fire a heap-changed event when changing the number of dice by zero', () => {
        let fired = false;
        heap.heapChangedEvent.subscribe( () => {fired = true;} );
        heap.addDice( 0 );
        expect( fired ).toBeFalse();
    });

    it( 'should increase the number of dice by unity when hitting the add die button', () => {
        let oldCount = heap.count;
        heapDbgElem.query( By.css('#d'+inputFacets+'addDieButton') ).triggerEventHandler( 'click' );
        expect( heap.count ).toEqual( oldCount+1 );
    });
    
    it( 'should decrease the number of dice by unity when hitting the remove die button', () => {
        let oldCount = 4;
        heap.addDice( oldCount-1 );
        heapDbgElem.query( By.css('#d'+inputFacets+'removeDieButton') ).triggerEventHandler( 'click' );
        expect( heap.count ).toEqual( oldCount-1 );
    });

    it( 'should activate the remove die button when adding die', () => {
        heap.addDice(2);
        const btn = heapDbgElem.query( By.css('#d'+inputFacets+'removeDieButton') );
        fixture.detectChanges();
        expect( btn.properties['disabled'] ).toBeFalse();
    });
    
    it( 'should dectivate the remove die button when reducing the number of dice to unity', () => {
        const btn = heapDbgElem.query( By.css('#d'+inputFacets+'removeDieButton') );
        heap.addDice(1);
        fixture.detectChanges();
        heap.addDice( 1-heap.count );
        fixture.detectChanges();
        expect( btn.properties['disabled'] ).toBeTrue();
    });
    
    it( 'should not dectivate the remove die button when reducing the number of dice to a number greater than unity', () => {
        const btn = heapDbgElem.query( By.css('#d'+inputFacets+'removeDieButton') );
        heap.addDice(5);
        fixture.detectChanges();
        heap.addDice( 2-heap.count );
        fixture.detectChanges();
        expect( btn.properties['disabled'] ).toBeFalse();
    });

    // _______________ rolling the heap _______________

    it( 'should display the total after rolling the dice', () => {
        heap.addDice( 3 );
        let result = heap.rollDice();
        fixture.detectChanges();

        const elem = heapNatElem.querySelector('.heapTotal')!;
        expect( elem.textContent ).toEqual( 'Total: '+result );
    });
    
    it( 'should have the correct individual outcomes of each die after rolling the dice', () => {
        const newDice = 3;
        heap.addDice( newDice ); // one die is there from the beginning on
        heap.rollDice();
        fixture.detectChanges();

        const regex = /.+,.+,.+,.+/;
        expect( regex.test( heap.outcome ) ).toBeTrue();
    });

    it( 'should display the individual outcomes of each die after rolling the dice', () => {
        const newCount = 4;
        heap.addDice( newCount - 1 ); // one die is there from the beginning on
        heap.rollDice();
        fixture.detectChanges();

        const elem = heapNatElem.querySelector('.dieRolls')!;
        expect( elem.textContent ).toEqual( 'Rolls: '+heap.outcome );
    });
    
    it( 'should fire a single-heap-rolled event when just the heap is rolled', () => {
        let total = -1;
        heap.rollSingleHeapEvent.subscribe( result => total = result );
        heap.rollDiceOfHeap();
        expect( total ).toEqual( heap.total );
    });

    // _______________ removing the heap _______________

    it( 'should fire a single-heap-rolled event when just the heap is rolled', () => {
        let number = -1;
        heap.removeHeapEvent.subscribe( heapFacets => number = heapFacets );
        heap.removeHeap();
        expect( number ).toEqual( inputFacets );
    });
    
    // _______________ misc _______________
    
    it( 'getter of descriptor', () => {
        const newCount = 5;
        heap.count = newCount;
        const expected = newCount+'d'+inputFacets;
        expect( heap.getHeapDescription() ).toEqual( expected );
    });
    
});