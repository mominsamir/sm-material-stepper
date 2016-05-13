'use strict';

/**
 * @ngdoc function
 * @name gjStepperApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gjStepperApp
 */
angular.module('gjStepperApp')
  .controller('MainCtrl',['$q','$timeout',MainCtrl]);

   function MainCtrl ($q,$timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    this.user = {};

    this.next = function(){
    	alert();
    }

    this.completed = function(){
      //alert(' I am completed');
      console.log('completed', this.user);
    }
    
    this.exitValidation = function(){
  /*        var d = $q.defer();
          $timeout(function(){
             d.resolve(true);
          }, 2000);
          return d.promise;*/
          return true;
    }

  };
