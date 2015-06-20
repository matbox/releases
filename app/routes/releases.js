import Ember from 'ember';

var AnalyticsService = {
  track: function(eventName, data) {
    console.log("Tracking analytics hit with ", eventName, data);
  }
};

export default Ember.Route.extend({
  model: function(params) {
    var url = 'https://api.github.com/repos/' + params.owner + '/' + params.repo + '/releases';
    return Ember.$.getJSON(url).then(function(data) {
      data.forEach(function(release) {
        release.created_at = new Date(release.created_at);
        release.published_at = new Date(release.published_at);
      });
      return data;
    });
  },
  actions: {
    selectRelease: function(release) {
      AnalyticsService.track(release.name, release);
      this.transitionTo('releases.show', release);
    }
  }
});
