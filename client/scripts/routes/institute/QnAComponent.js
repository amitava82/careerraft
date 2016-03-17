import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';
import {Collapse} from 'react-bootstrap';

import {loadQnA, saveQuestion, saveAnswer, saveReply} from '../../redux/modules/qna';
import {createToast} from '../../redux/modules/toast';
import {promptLogin} from '../../redux/modules/session';

import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';

@connect(state => state)
export default class QnAComponent extends React.Component {

    static propTypes = {
        org: React.PropTypes.string
    };    
    
    constructor(...args){
        super(...args);    
        this.state = {
            qns: [],
            replying: false,
            replyText: null,
            asking: false,
            question: null,
            answering: false,
            answer: null
        }
    }
    
    componentDidMount(){
        this.load(this.props.org);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.org !== nextProps.org){
            this.load(nextProps.id);
        }      
    }
    
    load(id){
        this.props.dispatch(loadQnA(id));
    }
    
    @autobind
    toggleAsk(){
        if(!this.props.session_store.isLoggedIn){
            this.props.dispatch(promptLogin('Please login to ask question.'));
            return;
        }
        this.setState({asking: !this.state.asking});
    }
    
    @autobind
    onQuestionChange(e){
        this.setState({question: e.target.value});
    }
    
    toggleAddReply(id){
        this.setState({replying: id});
    }
    
    @autobind
    onReplyChange(e){
        this.setState({replyText: e.target.value});
    }
    
    saveReply(q_id, a_id){
        this.props.dispatch(saveReply(q_id, a_id, this.state.replyText)).then(
            r => {
                this.setState({replying: false, replyText: null});
                this.props.dispatch(createToast('Your reply posted.'));
            },
            e => this.props.dispatch(createToast(e))
        )
    }
    
    @autobind
    saveQuestion(){
        this.props.dispatch(saveQuestion(this.props.org, this.state.question)).then(
            r => {
                this.setState({asking: false, question: null});
                this.props.dispatch(createToast('Your question posted.'));
            },
            e => this.props.dispatch(createToast(e))
        )
    }
    
    @autobind
    onAnswerChange(e){
        this.setState({answer: e.target.value});
    }
    
    @autobind
    toggleAnswer(id){
        this.setState({answering: id});
    }
    
    @autobind
    saveAnswer(q){
        this.props.dispatch(saveAnswer(q, {org: this.props.org, body: this.state.answer})).then(
            r => {
                this.props.dispatch(createToast('Your answer saved.'));
                this.setState({answer: null, answering: null});
            },
            e => this.props.dispatch(createToast(e))
        )
    }

    render() {
        const {replying, replyText, asking, question, answering, answer} = this.state;
        const {qna: {ids, entities, loading, error}, session_store: {user}, org} = this.props;
        
        if(error){
            return <p className="alert alert-danger">{error.message}</p>
        }
        
        const canReply = user && ((user.org == org) || user.role === 'ADMIN');
        
        const list = ids.reduce((memo, i) => {
            const ent = entities[i];
            if(ent.org !== org) return memo;
            
            const answ = ent.answers.map(a => {
                
                const replies = a.replies.map((r, idx) => {
                   return (
                       <div className="qna-reply" key={idx}>
                            <div className="reply-action">
                                
                            </div>           
                           <div className="reply-text">
                                <div>
                                    <span className="strong">{r.user.name}</span>
                                    {' '}
                                    <span className="sm">{new Date(r.createdAt).toDateString()}</span>
                                </div>
                                <p>{r.body}</p>
                           </div>
                       </div>
                   ) 
                });
                
                return (
                    <div className="qna-answer row" key={a._id}>

                        <Avatar width="48" height="48" url={a.user.photo} name={a.user.name} />
                        <div className="col-xs-11">
                            <p className="qna-author">
                                <span className="strong">{a.user.name}</span> - 
                                {' '}
                                <span className="sm">{new Date(a.createdAt).toDateString()}</span>
                            </p>
                            <p className="qna-text">{a.body}</p>
                            <div className="qna-replies">
                                {replies}
                                <div className="qna-replies-add">
                                    <Collapse in={replying == a._id}>
                                        <div className="form-group">
                                            <textarea value={replyText} onChange={this.onReplyChange} className="form-control m-bm"  placeholder="Compose your reply..."></textarea>
                                            <button disabled={loading} onClick={() => this.saveReply(i, a._id)} className="btn btn-primary btn-sm">Save</button>
                                            <button onClick={() => this.toggleAddReply(null)} className="btn btn-link btn-sm">Cancel</button>
                                        </div>
                                    </Collapse>
                                    {replying == a._id ? null : <button onClick={() => this.toggleAddReply(a._id)} className="btn btn-link btn-sm">Add a reply to this answer</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            });
            
            const showAnswerPane = answering == ent._id;
            
            memo.push (
                <div className="qna-item" key={i}>
                    <p className="text-headline text-info" to={`/institute/${i._org}/questions/${i}`}>{ent.title}</p>
                     <div className="qna-author text-subhead m-bl">
                            Asked by <span className="strong">{ent.user.name}</span> - <span className="text-muted">{new Date(ent.createdAt).toDateString()}</span>
                     </div>
                    <div className="qna-answer-block container-fluid">
                        <div className="qna-answers">
                            {answ.length ? answ : (
                                <div>
                                    <p className="text-muted">
                                        Not answered yet. 
                                        {canReply ? <button onClick={()=>this.toggleAnswer(ent._id)} className="btn btn-link">Answer</button> : null}
                                    </p>
                                  
                                    <Collapse in={showAnswerPane} className="qna-answer-editor">
                                        <div className="form-group">
                                            <textarea value={answer} className="form-control m-bm" onChange={this.onAnswerChange} placeholder="Please write your answer here in maximun 4000 characters"></textarea> 
                                            <button disabled={loading} onClick={() => this.saveAnswer(ent._id)} className="btn btn-primary">Submit</button>       
                                            <button onClick={()=>this.toggleAnswer(null)} className="btn btn-link">Cancel</button>    
                                        </div> 
                                    </Collapse>
                                
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            
            return memo;
        }, []);
        
        return (
            <div className="qna-component">
                {canReply ? null : 
                <div className="text-right">
                    <button onClick={this.toggleAsk} className="btn btn-default"><i className="fa fa-comment" /> Ask a question</button>
                </div>
                }
                <Collapse in={asking} className="qna-editor">
                    <div className="form-group">
                        <textarea value={question} className="form-control m-bm" onChange={this.onQuestionChange} placeholder="Please write your question here in maximun 200 characters"></textarea> 
                        <button disabled={loading} onClick={this.saveQuestion} className="btn btn-primary">Submit</button>       
                        <button onClick={this.toggleAsk} className="btn btn-link">Cancel</button>    
                    </div>       
                </Collapse>
                {list.length ? <h5>{list.length} Question(s)</h5> : <p className="text-title">No questions asked. Be first to ask.</p>}
                
                {list}
            </div>
        )
    }
    
}