// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    //console.log("1:");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //console.log("works!");
    }else {
      //console.log("nopes");
    }
    if(window.StatusBar) {
      //console.log("3:");
      StatusBar.styleDefault();
    }
  });
})

/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */

.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      console.log("save project factory:" + JSON.stringify(projects));
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      console.log("new project factory:");
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      console.log("parseInt(window.localStorage['lastActiveProject']):",parseInt(window.localStorage['lastActiveProject']));
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', ["$scope", "$ionicModal","$timeout","Projects","$ionicSideMenuDelegate","$ionicSlideBoxDelegate","$ionicTabsDelegate","$ionicListDelegate", function($scope,$ionicModal,$timeout,Projects,$ionicSideMenuDelegate,$ionicSlideBoxDelegate,$ionicTabsDelegate,$ionicListDelegate){
  console.log("inside todo controller:");
  /*$scope.tasks = [
    {'title':'Collect coins'},
    {'title':'Eat mushrooms'},
    {'title':'Get high enough to grab the flag'},
    {'title':'Find the Princess'}
  ];*/

  /*// No need for testing data anymore
  $scope.tasks = [];
  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      console.log("Inside fromTemplateUrl:");
      console.log("1:" ,modal);
      $scope.taskModal = modal;
      console.log("2:",$scope.taskModal);
    });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    console.log("Inside createTask new task:");
    console.log("Before Tasks:" ,$scope.tasks);
    $scope.tasks.push({
      title: task.title
    });
    console.log("After Tasks:" + JSON.stringify($scope.tasks));
    $scope.taskModal.hide();
    task.title = "";
  };

  // Open our new task modal
  $scope.newTask = function() {
    console.log("New task method>>>>>>>>>>>>>>>:");
    console.log("3 show :",$scope.taskModal);
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    console.log("Inside close new task:");
    $scope.taskModal.hide();
  };*/
  
  // A utility function for creating a new project
  // with the given projectTitle

  var createProject = function(projectTitle) {
    console.log("Inside create project:" ,projectTitle);

    var newProject = Projects.newProject(projectTitle);
    console.log("newProject in createProject:" ,newProject);
    $scope.projects.push(newProject);

    console.log("$scope.projects:" + JSON.stringify($scope.projects));

    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }


  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
  console.log("$scope.activeProject:" ,$scope.activeProject);
  console.log("Projects.getLastActiveIndex():" ,Projects.getLastActiveIndex());


  // Called to create a new project
  $scope.newProject = function() {
    console.log("new Project prompt:");
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    console.log("$scope.projects.length" ,$scope.projects.length);
    console.log("selectProject>>>>>project,index" , project, index);
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {

    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    console.log("Inside toggleProjects function" );
    $ionicSideMenuDelegate.toggleLeft();
  };


  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    console.log("$scope.projects.length>>>" ,$scope.projects.length);
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        console.log("projectTitle>>>" ,projectTitle);
        if(projectTitle) {
          console.log("1");
          createProject(projectTitle);
          break;
        }
      }
    }
  });

  $scope.start = function() {
    console.log("Inside next slide:");
    $ionicSlideBoxDelegate.next(1);
  }

  $scope.previousSlide = function() {
    console.log("Inside previous slide:");
    $ionicSlideBoxDelegate.previous(1);
  }

  $scope.selectTabWithIndex = function(index) {
    console.log("selectTabWithIndex with index:" ,index);
    $ionicTabsDelegate.select(index);
  }

/*  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

 $scope.items = [
    {'title':'item1', 'description':'item1 description'},
    {'title':'item2','description':'item2 description'},
    {'title':'item3','description':'item3 description'},
    {'title':'item4','description':'item4 description'}
  ];*/

  $scope.items = [1, 2, 3, 4];
  $scope.moveItem = function(item, fromIndex, toIndex) {
    //Move the item in the array
    console.log("item,fromIndex,toIndex:",item, fromIndex, toIndex);
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
    console.log("$scope.items array:" , $scope.items);
  };

}]);
