  /* ================================

    Session

    structures the user flow, e.g.:

    sessions: {
      session_id: {
        state: {
          stage: 0,
          step:  0,
        },
        event_log:  [{event},{event},{event},...],
        agent:      "agent_id",
        prospect:   "prospect_id",
        design:     "design_id",
        start_time: "timetimetime",
        end_time:   "timetimetime",
      }
    }

    TODO:
      make a private history function that keeps a record of what you've done

  ================================ */

providers.provider("Session", SessionProvider_);

function SessionProvider_ () {
  console.log('Session Provider started')

  var _ref,
      sessions_url,
      _ref_key,
      _user_key,
      fb_observable,
      state_stream;

  sessions_url = 'https://scty.firebaseio.com/sessions/';
  _ref_key = null;
  _user_key = null;

  this.setRefKey = function setRefKey(key){
    /* jshint -W030 */
    key && (_ref_key = key);
    /* jshint +W030 */
    console.log('ref_key in sessionProvider being set:', key);
  };

  this.$get = ["Clientstream", "User", function SessionProviderFactory(Client, User) {

    Client.listen('User: Loaded', loadSession );
    Client.listen('Stage: subscribed to statestream', bootstrapStreams );
    Client.listen('StageCtrl: restart session', restartSession);

    function loadSession (user_data) {
      /* jshint -W030 */
      user_data.session_id && (_ref_key = user_data.session_id);
      /* jshint +W030 */
      // make the ref
      if (_ref_key) {
        console.log('load the state from the user\'s previous session');
        // console.log('Session: _ref_key set on load');
        _ref = new Firebase(sessions_url).child(_ref_key);
      } else {
        console.log('there was no state, make a new one on the new session');
        _ref = new Firebase(sessions_url).push();
        _ref.update({user_id: user_data.user_id});
        _ref.update({state:{stage: 0, step: 0}});
      }
      bootstrapStreams();
      _ref.once('value', newSessionLoaded )
    }


    function bootstrapStreams() {
      // create overservables and streams
      fb_observable = _ref.observe('value');
      state_stream = _ref.child('state').observe('value');
    }

    function newSessionLoaded (ds){
      var data = ds.exportVal();
      console.log('newSession', data);
      User.ref().update({session_id: _ref.key()});
      return Client.emit('Session: Session Loaded', data);
    }

    function restartSession () {
      var state_obj = {stage: 0, step: 0};
      _ref.child('state').set(state_obj);
    }

    function awesome_session_builder_brah () {
      return {
        // TODO: enable hotswap sessions
        // setRefKey: function (key){
        //   console.log('Session.setRefKey method called', key)
        //   key && (_ref_key = key);
        // },
        setUserKey: function (key){
          /* jshint -W030 */
          key && (_user_key = key);
          /* jshint +W030 */
        },
        ref: function () {return _ref;},
        id:     function (){ return _ref.key(); },
        stream: function (){ return fb_observable; },
        state_stream: function (){ return state_stream; },
        next:   function () { Client.emit('stage', "next");},
        back:   function () { Client.emit('stage', "back");},
      };
    }

    // always save your firebase references when you create them
    return new awesome_session_builder_brah();
  } ];
}
