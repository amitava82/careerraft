/**
 * Created by amitava on 20/02/16.
 */

export function sendMail(data){
    return {
        type: 'SEND_MAIL',
        payload: {
            promise: api => api.post('misc/send_mail', data)
        }
    }
}