import ajax from 'ic-ajax';
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params, transition) {
    var owner = transition.params.releases.owner,
      repo = transition.params.releases.repo;
    var url = 'https://api.github.com/repos/' + owner + '/' + repo + '/releases' + '/' + params.release_id;
    return ajax({
      url: url,
      type: 'get'
    }).then(function(release) {
      return ajax({
        url: 'https://api.github.com/markdown',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'text',
        data: JSON.stringify({
          text: release.body,
          mode: 'gfm',
          context: owner + '/' + repo
        })
      }).then(function(text) {
        release.body_html = text;
        return release;
      });
    });
  },
  afterModel: function(model, transition) {
    var owner = transition.params.releases.owner,
      repo = transition.params.releases.repo;
    return ajax({
      url: 'https://api.github.com/markdown',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'text',
      data: JSON.stringify({
        text: model.body,
        mode: 'gfm',
        context: owner + '/' + repo
      })
    }).then(function(text) {
      model.body_html = text;
      return model;
    });
  }
});
