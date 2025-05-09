angular.module('todoApp', [])
.controller('TodoController', function($scope, $interval) {
  $scope.tasks = [];
  $scope.newTask = '';
  $scope.newDeadline = null;
  $scope.statusFilter = 'all';

  $scope.addTask = function() {
    if ($scope.newTask) {
      $scope.tasks.push({
        name: $scope.newTask,
        done: false,
        timestamp: new Date(),
        deadline: $scope.newDeadline ? new Date($scope.newDeadline) : null,
        alerted: false
      });
      $scope.newTask = '';
      $scope.newDeadline = null;
    }
  };

  $scope.deleteTask = function(index) {
    $scope.tasks.splice(index, 1);
  };

  $scope.editTask = function(task) {
    const updated = prompt("Edit task:", task.name);
    if (updated !== null && updated.trim() !== '') {
      task.name = updated;
    }
  };

  $scope.setFilter = function(status) {
    $scope.statusFilter = status;
  };

  $scope.filteredTasks = function() {
    if ($scope.statusFilter === 'active') {
      return $scope.tasks.filter(t => !t.done);
    } else if ($scope.statusFilter === 'completed') {
      return $scope.tasks.filter(t => t.done);
    }
    return $scope.tasks;
  };

  // ⏰ Alarm check every 30s
  $interval(function() {
    const now = new Date().getTime();
    const audio = document.getElementById("notify-sound");

    $scope.tasks.forEach(task => {
      if (
        task.deadline &&
        !task.done &&
        !task.alerted &&
        task.deadline.getTime() - now < 60000 &&
        task.deadline.getTime() - now > 0
      ) {
        if (audio) audio.play(); // 🔊 Play notification
        alert(`⏰ Reminder: "${task.name}" is due in less than 1 minute!`);
        task.alerted = true;
      }
    });
  }, 30000);
});
