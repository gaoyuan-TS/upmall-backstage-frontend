
import  {Message} from 'iview';
export  default class messageTips {
   static Message(type,title,duration=1){
        Message.destroy()
        Message[type]({
            content:title,
            background: true,
            duration: duration
        });
    }
}