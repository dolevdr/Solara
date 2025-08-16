import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CampaignActionTypes, CreateCampaign, CreateCampaignFailure, DeleteCampaign, DeleteCampaignFailure, DeleteCampaignSuccess, LoadCampaignById, LoadCampaignByIdFailure, LoadCampaignByIdSuccess, LoadCampaignPagination, LoadCampaignsFailure, LoadCampaignsSuccess, ResetCampaignsState, UpdateCampaign, UpdateCampaignFailure, UpdateCampaignSuccess } from './campaigns.actions';
import { selectAllCampaigns, selectPagination } from './campaigns.selectors';
import { CampaignsService } from './campaigns.service';

@Injectable()
export class CampaignsEffects {

    loadCampaigns$ = createEffect(() => this.actions$.pipe(
        ofType(CampaignActionTypes.LOAD_CAMPAIGNS),
        concatLatestFrom(() => [this.store.select(selectAllCampaigns), this.store.select(selectPagination)]),
        switchMap(([, campaigns, pagination]) => {
            if (campaigns?.length > 0) {
                return of(new LoadCampaignsSuccess({
                    campaigns,
                    pagination
                }));
            }
            return this.campaignsService.getCampaigns()
                .pipe(
                    map(response => new LoadCampaignsSuccess({
                        campaigns: response.campaigns,
                        pagination: response.pagination
                    })),
                    catchError(error => of(new LoadCampaignsFailure({ error: error.message })))
                );
        })
    ));

    loadCampaignPagination$ = createEffect(() => this.actions$.pipe(
        ofType(CampaignActionTypes.LOAD_CAMPAIGN_PAGINATION),
        switchMap((action: LoadCampaignPagination) => {
            const { page, limit, sortBy, direction } = action.payload;
            return this.campaignsService.getCampaigns(page, limit, sortBy, direction)
                .pipe(
                    map(response => new LoadCampaignsSuccess({
                        campaigns: response.campaigns,
                        pagination: response.pagination
                    })),
                    catchError(error => of(new LoadCampaignsFailure({ error: error.message })))
                );
        })
    ));

    loadCampaignById$ = createEffect(() => this.actions$.pipe(
        ofType(CampaignActionTypes.LOAD_CAMPAIGN_BY_ID),
        switchMap((action: LoadCampaignById) => {
            return this.campaignsService.getCampaignById(action.payload.id)
                .pipe(
                    map(campaign => new LoadCampaignByIdSuccess({ campaign })),
                    catchError(error => of(new LoadCampaignByIdFailure({ error: error.message })))
                );
        })
    ));

    createCampaign$ = createEffect(() => this.actions$.pipe(
        ofType(CampaignActionTypes.CREATE_CAMPAIGN),
        switchMap((action: CreateCampaign) =>
            this.campaignsService.createCampaign(action.payload.campaign)
                .pipe(
                    map(() => {
                        return new ResetCampaignsState();
                    }),
                    tap(() => this.router.navigate(['/campaigns'])),
                    catchError(error => of(new CreateCampaignFailure({ error: error.message })))
                ))
    ));

    updateCampaign$ = createEffect(() => this.actions$.pipe(
        ofType(CampaignActionTypes.UPDATE_CAMPAIGN),
        switchMap((action: UpdateCampaign) =>
            this.campaignsService.updateCampaign(action.payload.id, action.payload.campaign)
                .pipe(
                    map(campaign => new UpdateCampaignSuccess({ campaign })),
                    catchError(error => of(new UpdateCampaignFailure({ error: error.message })))
                ))
    ));

    deleteCampaign$ = createEffect(() => this.actions$.pipe(
        ofType(CampaignActionTypes.DELETE_CAMPAIGN),
        switchMap((action: DeleteCampaign) =>
            this.campaignsService.deleteCampaign(action.payload.id)
                .pipe(
                    map(() => new DeleteCampaignSuccess({ id: action.payload.id })),
                    catchError(error => of(new DeleteCampaignFailure({ error: error.message })))
                ))
    ));


    constructor(
        private readonly actions$: Actions,
        private readonly campaignsService: CampaignsService,
        private readonly router: Router,
        private readonly store: Store
    ) { }
}
