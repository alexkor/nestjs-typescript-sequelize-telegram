interface User {
    id: number
    first_name: string
    last_name: string
    photo_url: string
    user_name: string
    language_code: string
    allows_write_to_pm: boolean
}
export class ScriptSignInUserDto {
    // TODO: parse string to type
    // private _user: string
    // get user(): User {
    //     return JSON.parse(this._user)
    // }
    // set user(value: string) {
    //     this._user = value
    // }
    user: string
    hash: string
    auth_date: number
    query_id: string
    signature: string
}