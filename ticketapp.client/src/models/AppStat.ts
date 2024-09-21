export enum AppStatType
{
    TicketsOpened,
    TicketsClosed,
    TicketsClosedLate,
    ChatsSent,
    UsersRegistered
}

export interface AppStat
{
    appStatType: AppStatType,
    value: number
}

export function GetAppStatOfType(type: AppStatType, appStats?: AppStat[]) : AppStat | undefined
{
    let val: AppStat | undefined = undefined;
    appStats?.map(x => {
        if (x.appStatType == type)
        {
            val = x;
        }
    })
    return val;
}