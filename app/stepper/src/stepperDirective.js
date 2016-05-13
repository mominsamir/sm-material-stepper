function StepperCtrl($q,$element){
  var self = this; 
  self.tabs = [];
  self.currentTab = 0
  self.lastTab = false;
  self.totalTabs = 0;

  self.addTab = function(tab){
    self.tabs.push(tab);
  } 

  self.goToTab = function(index){
    self.currentTab = index;
  }

  self.getTabElementIndex = function(step){
      var t = $element[0].getElementsByTagName('step');
      return Array.prototype.indexOf.call(t, step[0]);
  }

  self.insertTab = function(tabData,index){
    self.tabs.push(tabData); 
    self.totalTabs = self.tabs.length;    
  }

  self.moveNext = function (){
    if(self.lastTab) return;

    var currentStepScope =self.tabs[self.currentTab].scope
    if(!self.isValidStep(currentStepScope)) return;

    currentStepScope.complete =true;

    self.goToTab(self.currentTab+1);

    if(self.currentTab >= (self.tabs.length-1)){
      self.lastTab=true;
    }else{
      self.lastTab=false;
    }     
  }



  self.movePrevious = function (){
    if(self.currentTab===0) return;
    self.lastTab=false;
    self.goToTab(self.currentTab-1);
  };

  self.finish = function(){
    self.onFinish();    
  }

  self.cancel = function(){
    self.onCancel();    
  }

  self.isValidStep = function(currentStepScope){
      if(currentStepScope.valid === undefined){
        return true;
      }
      if(typeof currentStepScope.valid === 'boolean'){
        return currentStepScope.valid;
      }

      if(angular.isFunction(currentStepScope.valid.then)){
          defer = $q.defer();
          currentStepScope.valid.then(function(response){
            defer.resolve(response);
          });
          return defer.promise;
      } else {
        return true;
      }      
  }

}


function stepper() {

 
  return {
    restrict: 'E',
    controller: ['$q','$element',StepperCtrl],
    controllerAs: 'vm',
    bindToController:true,
    transclude:true,
    replace:true,
    templateUrl:'stepper/src/stepper.html',
    scope:{
      type:'=stepperType',
      onFinish: '&',
      onCancel: '&',      
    }
   }
}

function step() {
  return {
    require: '^?stepper',
    terminal:true,
    scope:    {
      active:   '=?mdActive',
      disabled: '=?ngDisabled',
      valid: '='
    },    
    compile: function (element, attr) {
      var label = firstChild(element, 'step-title'),
          body  = firstChild(element, 'step-content');

      if (label.length == 0) {
        label = angular.element('<step-title></step-title>');
        if (attr.label) label.text(attr.label);
        else label.append(element.contents());

        if (body.length == 0) {
          var contents = element.contents().detach();
          body         = angular.element('<step-content></step-content>');
          body.append(contents);
        }
      }

      element.append(label);
      if (body.html()) element.append(body);

      return postLink;
    }
  };

    function postLink (scope, element, attr, ctrl) {
      if (!ctrl) return;
      scope.complete =false;
      var index = ctrl.getTabElementIndex(element),
          body  = firstChild(element, 'step-content').remove(),
          label = firstChild(element, 'step-title').remove();
          data  = ctrl.insertTab({
            scope:    scope,
            parent:   scope.$parent,
            index:    index,
            element:  element,
            template: body.html(),
            label:    label.html()
          }, index);

      scope.select   = scope.select || angular.noop;
      scope.deselect = scope.deselect || angular.noop;

      scope.$watch('active', function (active) { if (active) ctrl.select(data.getIndex(), true); });

    }

    function firstChild (element, tagName) {
      var children = element[0].children;
      for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        if (child.tagName === tagName.toUpperCase()) return angular.element(child);
      }
      return angular.element();
    }
}


function stepTemplate ($compile, $mdUtil) {
  return {
    restrict: 'A',
    link:     link,
    scope:    {
      template:     '=stepTemplate',
      connected:    '=?connectedIf',
      compileScope: '=stepScope'
    },
    require:  '^?stepper'
  };
  function link (scope, element, attr, ctrl) {
    var compileScope = scope.compileScope;
    element.html(scope.template);
    $compile(element.contents())(compileScope);
   }
}


function stepNext(){
  function link($scope,$element,$attr,ctrl){
/*    $element.attr('disabled','true');*/
    function clickOnButton(e){
      e.preventDefault();
        ctrl.moveNext();
      //$scope.$apply(function() {});      
    };

    $element.on('click',clickOnButton);

  }
  return{
    restrict: 'A',
    require: '^stepper',
    link: link
  }
} 

function stepPreivous(){
  function link($scope,$element,$attr,ctrl){
    function clickOnButton(e){
      e.preventDefault();
      /*$scope.$apply(function() {
        
      });*/
      ctrl.movePrevious();      
    };

    $element.on('click',clickOnButton);

  }
  return{
    restrict: 'A',
    require: '^stepper',
    link: link
  }
} 

function stepFinish(){
  function link($scope,$element,$attr,ctrl){
        
    $scope.$watch('$parent.vm.lastTab',function(n,o){
      if(n){
        $element[0].style.display = 'block';
      }else{
        $element[0].style.display = 'none';
      }

    })

    function clickOnButton(e){
      e.preventDefault();
      
        ctrl.finish();
      //$scope.$apply(function() {});      
    };

    $element.on('click',clickOnButton);

  }
  return{
    restrict: 'A',
    require: '^stepper',
    link: link
  }
} 



function stepCancel(){
  function link($scope,$element,$attr,ctrl){
    function clickOnButton(e){
      e.preventDefault();
      $scope.$apply(function() {
        ctrl.cancel();
      });      
    };

    $element.on('click',clickOnButton);

  }
  return{
    restrict: 'A',
    require: '^stepper',
    link: link
  }
} 

angular.module('smStepper')
.directive('stepper',[stepper])
.directive('step',[step])
.directive('stepTemplate', stepTemplate)
.directive('stepNext', stepNext)
.directive('stepPreivous', stepPreivous)
.directive('stepFinish', stepFinish)
.directive('stepCancel', stepCancel);