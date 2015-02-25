var GitProfiler = {

    init: function() {
      GitProfiler.searchBox            = $('#search_box');
      GitProfiler.searchButton         = $('#search_button');
      GitProfiler.headerSearchButton   = $('#header_search_button');
      GitProfiler.headerSearchField    = $('#header_search_box');            
      GitProfiler.contentHolder        = $('#results');
      GitProfiler.usernameBox          = $('#username');
      GitProfiler.fullnameBox          = $('#fullname');
      GitProfiler.numberOfFollowers    = $('#numFFlws');
      GitProfiler.numberOfFollowing    = $('#numFllwd');
      GitProfiler.listOfOrgs           = $('#listOrgs');
      GitProfiler.listOfrepos          = $('#reposList');      
      GitProfiler.numberOfOrgs         = $('#numOrgs');
      GitProfiler.numberOfRepos        = $('#numRepos');
      GitProfiler.userImage            = $('#user_avatar');
      GitProfiler.errorMessageHolder   = $('#errMessage');
      GitProfiler.activateSearch(); 
    },

    activateSearch: function() {
      GitProfiler.searchButton.click(GitProfiler.search);
      GitProfiler.headerSearchButton.click(GitProfiler.headerSearch);     
    },

    generateurl: function() {
      return  'https://api.github.com/users/' + GitProfiler.searchBox.val();      
    },

    generateHeaderUrl : function() {
      return 'https://api.github.com/users/' + GitProfiler.headerSearchField.val();
    },

    appendResult: function(response) {
      GitProfiler.clearFields();
      GitProfiler.usernameBox.text(response.login);
      GitProfiler.fullnameBox.text(response.name);
      GitProfiler.numberOfFollowers.text(response.followers);
      GitProfiler.numberOfFollowing.text(response.following);
      GitProfiler.numberOfRepos.text(response.public_repos);
      GitProfiler.userImage.attr('src', response.avatar_url);
    },

    getRepositories: function(response) {
      var repoURL = response.repos_url;
      var RepoList = '';
      $.ajax({
        type: 'GET',
        url: repoURL,
        success: function(feedback) {
          console.log(feedback);
          if( feedback.length > 0){
            $.each(feedback, function(i){              
              RepoList += '<a target="_blank" href="' + feedback[i].html_url + '" class="list-group-item"><span>' + 
              feedback[i].full_name + '</span><span class="badge">' + feedback[i].created_at.substring(0,10) + '</span></a>';
            });           
          } else {
            RepoList = '<p>This user has no repository.</p>';
          } 
           //Append the list of repositories here..
          GitProfiler.listOfrepos.append(RepoList);                   
        }
      });
    },

    getOrganizations: function(response) {
      var orgsURL = response.organizations_url;
      var orgList = '';
      $.ajax({
        type: 'GET',
        url: orgsURL,
        success: function(feedback) {
          if( feedback.length > 0){ 
            $.each(feedback, function(i){
              orgList += '<li class="list-group-item">' + feedback[i].login + '</li>';
            });           
          } else {
            orgList = '<p>None.</p>';
          } 
           //Append the list of organizations here..
          GitProfiler.numberOfOrgs.text(feedback.length);
          GitProfiler.listOfOrgs.append(orgList);                   
        }
      });
    }, 

    clearFields: function(){
      GitProfiler.listOfOrgs.children().remove();
      GitProfiler.listOfrepos.children().remove();
      GitProfiler.numberOfOrgs.text('');
      GitProfiler.usernameBox.text(''); 
      GitProfiler.fullnameBox.text('');
      GitProfiler.errorMessageHolder.hide();
      $('#errMessage').hide();
      $('#preloader').hide();
    },  

    search: function() {
      $('#errMessage').hide();
      $('#search_area').hide();
      $('#preloader').show();      
      $('#intro_text').remove();
      var url = GitProfiler.generateurl();      
      $.ajax({
        type: 'GET',
        url: url,
        success: function(response) {
          $('#header_searchArea').show();
          GitProfiler.getOrganizations(response);
          GitProfiler.getRepositories(response); 
          $('#preloader').hide();         
          GitProfiler.searchBox.val('');
          GitProfiler.appendResult(response);          
          GitProfiler.contentHolder.show();
        },
        error: function(err){
          $('#preloader').hide();
          GitProfiler.contentHolder.hide();
          GitProfiler.errorMessageHolder.show();
          GitProfiler.errorMessageHolder.text("Error " + err.status + ": " + err.statusText);          
        }
      });      
    },

    headerSearch: function() {
      GitProfiler.contentHolder.hide();
      $('#preloader').show(); 
      $('#errMessage').hide();    
      $('#search_area').hide();      
      $('#intro_text').remove();
      var url = GitProfiler.generateHeaderUrl();      
      $.ajax({
        type: 'GET',
        url: url,
        success: function(response) {
          $('#preloader').hide(); 
          GitProfiler.getOrganizations(response);
          GitProfiler.getRepositories(response);
          GitProfiler.headerSearchField.val('');          
          GitProfiler.searchBox.val('');
          GitProfiler.appendResult(response);          
          GitProfiler.contentHolder.show();
        },
        error: function(err){
          $('#preloader').hide();
          GitProfiler.contentHolder.hide();
          GitProfiler.errorMessageHolder.show();
          GitProfiler.errorMessageHolder.text("Error " + err.status + ": " + err.statusText);          
        }
      });      
    }
};

$(document).ready(GitProfiler.init);