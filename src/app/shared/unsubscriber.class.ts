import { Directive, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Directive()

export class Unsubscriber implements OnDestroy {
    protected unsubscribe = new Subject<void>();

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}