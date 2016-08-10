import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText } from '../Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


export default class ApplicationForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    application: PropTypes.object.isRequired,
    updateApplication: PropTypes.func.isRequired,
    clients: React.PropTypes.array.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.application !== this.props.application || nextProps.loading !== this.props.loading;
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }
    const application = this.props.application.toJS();
    const name = application.name||application.client_id;
    const clientId = application.client_id;
    const options = [{value:'saml',text:'saml'},{value:'openid',text:'openid'},{value:'ws-fed',text:'ws-fed'}];
    const callbacks = application.callbacks?application.callbacks:[];
    const clients = this.props.clients;
    const appLogo = application.client_metadata&&application.client_metadata['sso-dashboard-logo']?application.client_metadata['sso-dashboard-logo']:'';
    const appType = application.client_metadata&&application.client_metadata['sso-dashboard-type']?application.client_metadata['sso-dashboard-type']:'';
    const callback = application.client_metadata&&application.client_metadata['sso-dashboard-callback']?application.client_metadata['sso-dashboard-callback']:'';
    const appEnabled = application.client_metadata&&application.client_metadata['sso-dashboard-enabled']?application.client_metadata['sso-dashboard-enabled']=='1':false;
    return <div>
      <Alert stack={{limit: 3}} position='top' />
      <form className="appForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
           obj[el.name] = el.value;
        });
        if(!obj['sso-dashboard-enabled'])
          obj['sso-dashboard-enabled']='0';
        return this.props.updateApplication(application.client_id,obj, function(callback) {
          Alert.info('Application meta-data was successfully saved.',{
            effect: 'slide',
            onClose: callback
          });
        });
      }}>
        <div>
          <label>Name</label> <input name="name" className="form-control" type="text" defaultValue={name} required />
        </div>
        <div>
          <label>Client</label>
          <select className="form-control" name="client" defaultValue={clientId} required>
            <option value=""></option>
            {clients.map((client, index) => {
              return <option key={index}
                             value={option.client_id}>{option.name||option.client_id}</option>;
            })}
          </select>
        </div>
        <div>
          <label>Type</label>
          <select className="form-control" name="sso-dashboard-type" defaultValue={appType} required>
            <option value=""></option>
            {options.map((option, index) => {
              return <option key={index}
                             value={option.value}>{option.text}</option>;
            })}
          </select>
      </div>
      <div>
        <label>Logo</label> <input name="logo" className="form-control" type="url"
                                   defaultValue={appLogo}
                                   required />
        </div>
        <div>
          <label>Callback</label>
            <select className="form-control" name="callback" defaultValue={callback} required>
            <option value=""></option>
            {callbacks.map((callback, index) => {
              return <option key={index}
                             value={option}>{option}</option>;
            })}
          </select>
        </div>
        <div>
        <label>Enabled?</label> <input name="sso-dashboard-enabled" type="checkbox" value={1} style={{'marginLeft':'10px'}} defaultChecked={appEnabled} />
      </div>
      <br />
      <button className="btn btn-success">Update</button>
      </form>
    </div>
  }
}
