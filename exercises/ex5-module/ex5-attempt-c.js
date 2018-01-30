var Helpers = {
  maxVisibleWorkDescriptionLength: 20,
  minWorkDescriptionLength: 5,
  maxWorkTime: 600,
  validateWorkEntry(description, minutes) {
    if (description.length < Helpers.minWorkDescriptionLength) return false;
    if (
      /^\s*$/.test(minutes) ||
      Number.isNaN(Number(minutes)) ||
      minutes < 0 ||
      minutes > Helpers.maxWorkTime
    ) {
      return false;
    }

    return true;
  },
  formatWorkDescription(description) {
    if (description.length > Helpers.maxVisibleWorkDescriptionLength) {
      description = `${description.substr(
        0,
        Helpers.maxVisibleWorkDescriptionLength
      )}...`;
    }
    return description;
  },
  formatTime(time) {
    var hours = Math.floor(time / 60);
    var minutes = time % 60;
    if (hours == 0 && minutes == 0) return '';
    if (minutes < 10) minutes = `0${minutes}`;
    return `${hours}:${minutes}`;
  }
};

var UI = setupUI();
UI.init();
var App = setupApp(UI);

// hard coding some initial data
App.addProject('client features');
App.addProject('overhead');
App.addProject('backlog');

function setupUI() {
  const projectTemplate =
    "<div class='project-entry'><h3 class='project-description' rel='js-project-description'></h3><ul class='work-entries' rel='js-work-entries'></ul><span class='work-time' rel='js-work-time'></span></div>";
  const workEntryTemplate =
    "<li class='work-entry'><span class='work-time' rel='js-work-time'></span><span class='work-description' rel='js-work-description'></span></li>";

  var $workEntryForm;
  var $workEntrySelectProject;
  var $workEntryDescription;
  var $workEntryTime;
  var $workEntrySubmit;
  var $totalTime;
  var $projectList;

  var projectElements = {};
  var workElements = {};

  var publicApi = {
    init: initUI,
    addProjectToList,
    addProjectSelection,
    addWorkEntryToList,
    updateProjectTotalTime,
    updateWorkLogTotalTime
  };

  return publicApi;

  // *****************************

  function initUI() {
    $workEntryForm = $('[rel*=js-work-entry-form');
    $workEntrySelectProject = $workEntryForm.find('[rel*=js-select-project]');
    $workEntryDescription = $workEntryForm.find('[rel*=js-work-description]');
    $workEntryTime = $workEntryForm.find('[rel*=js-work-time]');
    $workEntrySubmit = $workEntryForm.find('[rel*=js-submit-work-entry]');
    $totalTime = $('[rel*=js-total-work-time]');
    $projectList = $('[rel*=js-project-list]');

    $workEntrySubmit.on('click', submitNewWorkEntry);
  }

  function submitNewWorkEntry() {
    var projectId = $workEntrySelectProject.val();
    var description = $workEntryDescription.val();
    var minutes = $workEntryTime.val();

    if (!Helpers.validateWorkEntry(description, minutes)) {
      alert('Oops, bad entry . Try again.');
      $workEntryDescription[0].focus();
      return;
    }

    $workEntryDescription.val('');
    $workEntryTime.val('');
    App.addWorkToProject(Number(projectId), description, Number(minutes));
    $workEntryDescription[0].focus();
  }

  function addProjectToList(project) {
    var $project = $(projectTemplate);
    $project.attr('data-project-id', project.getId());
    $project
      .find('[rel*=js-project-description]')
      .text(project.getDescription());
    $projectList.append($project);
    projectElements[project.getId()] = $project;
  }

  function addProjectSelection(project) {
    var $option = $('<option></option>');
    $option.attr('value', project.getId());
    $option.text(project.getDescription());
    $workEntrySelectProject.append($option);
  }

  function addWorkEntryToList(project, workEntryData) {
    var $projectEntry = projectElements[project.getId()];
    var $projectWorkEntries = $projectEntry.find('[rel*=js-work-entries]');

    // create a new DOM element for the work entry
    var $workEntry = $(workEntryTemplate);
    $workEntry.attr('data-work-entry-id', workEntryData.id);
    $workEntry
      .find('[rel*=js-work-time]')
      .text(Helpers.formatTime(workEntryData.time));
    setupWorkDescription(
      workEntryData,
      $workEntry.find('[rel*=js-work-description]')
    );

    workElements[workEntryData.id] = $workEntry;

    // multiple work entries now?
    if (project.getWorkEntryCount(project.getId()) > 1) {
      let adjacenWorkEntryId, insertBefore;
      [adjacenWorkEntryId, insertBefore] = project.getWorkEntryLocation(
        workEntryData.id
      );

      if (insertBefore) {
        workElements[adjacenWorkEntryId].before($workEntry);
      } else {
        workElements[adjacenWorkEntryId].after($workEntry);
      }
    } else {
      // otherwise, just the first entry
      $projectEntry.addClass('visible');
      $projectWorkEntries.append($workEntry);
    }
  }

  function setupWorkDescription(workEntryData, $workDescription) {
    $workDescription.text(
      Helpers.formatWorkDescription(workEntryData.description)
    );

    if (
      workEntryData.description.length > Helpers.maxVisibleWorkDescriptionLength
    ) {
      $workDescription.addClass('shortened').on('click', function onClick() {
        $workDescription
          .removeClass('shortened')
          .off('click', onClick)
          .text(workEntryData.description);
      });
    }
  }

  function updateProjectTotalTime(project) {
    var $projectEntry = projectElements[project.getId()];
    $projectEntry
      .find('> [rel*=js-work-time]')
      .text(Helpers.formatTime(project.getTime()))
      .show();
  }

  function updateWorkLogTotalTime(time) {
    if (time > 0) {
      $totalTime.text(Helpers.formatTime(time)).show();
    } else {
      $totalTime.text('').hide();
    }
  }
}

function setupApp(UI) {
  var projects = [];
  var totalTime = 0;

  publicApi = {
    addProject,
    addWorkToProject
  };

  return publicApi;
  // **************************

  function addProject(description) {
    var project = Project(description);
    projects.push(project);

    UI.addProjectToList(project);
    UI.addProjectSelection(project);
  }

  function findProjectEntry(projectId) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].getId() === projectId) {
        return projects[i];
      }
    }
  }

  function addWorkToProject(projectId, description, minutes) {
    totalTime = (totalTime || 0) + minutes;

    var project = findProjectEntry(projectId);

    // create a new work entry for the list
    var workEntryData = {
      description: description,
      time: minutes
    };
    project.addWork(workEntryData);

    UI.addWorkEntryToList(project, workEntryData);
    UI.updateProjectTotalTime(project, workEntryData.time);
    UI.updateWorkLogTotalTime(totalTime);
  }
}

function Project(description) {
  var projectId = Math.round(Math.random() * 1e4);
  var work = [];
  var time = 0;

  var publicApi = {
    getId,
    getDescription,
    getTime,
    addWork,
    getWorkEntryCount,
    getWorkEntryLocation
  };
  return publicApi;

  // ******************

  function getId() {
    return projectId;
  }
  function getDescription() {
    return description;
  }
  function getTime() {
    return time;
  }
  function addWork(workEntryData) {
    workEntryData.id = work.length + 1;
    work.push(workEntryData);

    if (!time) {
      time = 0;
    }
    time += workEntryData.time;

    if (work.length > 1) {
      work.sort(function sortTimeDescending(a, b) {
        return b.time - a.time;
      });
    }
  }
  function getWorkEntryCount() {
    return work.length;
  }
  function getWorkEntryLocation(workEntryId) {
    var entryIdx;
    for (let i = 0; i < work.length; i++) {
      if (work[i].id == workEntryId) {
        entryIdx = i;
        break;
      }
    }

    if (entryIdx < work.length - 1) {
      return [work[entryIdx + 1].id, true];
    } else {
      return [work[entryIdx - 1].id, false];
    }
  }
}
