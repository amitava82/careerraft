/**
 * Created by amitava on 20/02/16.
 */
const app = 'raft';

export default function (module, constants) {
       return constants.map(i => {
           return `raft/${module}/${i}`;
       });
}