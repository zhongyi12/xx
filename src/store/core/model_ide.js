
const path = require('path');

const xArmLang = window.location.search.includes('lang=cn') ? 'cn' : 'en';

const IdeModel = {};
const self = IdeModel;

self.isReady = false;

self.consoleId = 10001;

self.projElTree = null;
self.codeItems = [];
self.selectFilePath = null;
self.selectNodePath = null;
self.selectNode = null;
self.projList = [];
self.curProjConfig = {};
self.curProjTree = {};
self.curProjExpandedKeys = [];

self.consoleItems = [];
self.curRunFileList = [];
self.selectConsoleItem = {};

self.dialogType = '';
self.dialogTitle = '';
self.dialogTips = '';
self.dialogInputText = '';
self.showProjsDialog = false;
self.showFileDialog = false;
self.showDeleteDialog = false;
self.showSettingDialog = false;

self.uniqueArr = (arr) => {
  const result = [];
  const hash = {};
  for (let i = 0, elem; (elem = arr[i]) != null; i += 1) {
    if (!hash[elem]) {
      result.push(elem);
      hash[elem] = true;
    };
  };
  return result;
};

self.isHasProj = (name) => {
  for (let i = 0; i < self.projList.length; i += 1) {
    if (self.projList[i].name === name) {
      self.dialogTips = xArmLang === 'cn' ? '项目名不能一样' : 'Project name can not be the same';
      return true;
    }
  }
  self.dialogTips = '';
  return false;
};

self.isRepeatFile = (name, isCreateFile) => {
  if (isCreateFile === true) {
    for (let i = 0; i < self.selectNode.children.length; i++) {
      if (self.selectNode.children[i].name === name) {
        self.dialogTips = xArmLang === 'cn' ? '名字不能一样' : 'The name cannot be the same';
        return true;
      };
    };
    self.dialogTips = '';
    return false;
  }
  else if (self.selectNode.path === '/') {
    return self.isHasProj(name);
  }
  else {
    let node = self.curProjTree;
    while (true) {
      const check = self.checkNodeHasChild(self.selectNode.path, node);
      if (check === true) {
        break;
      }
      else if (check === false) {
        node = null;
        break;
      }
      else {
        node  = check;
      }
    }
    if (node !== null) {
      for (let i = 0; i < node.children.length; i++) {
        if (name === node.children[i].name) {
          self.dialogTips = xArmLang === 'cn' ? '名字不能一样' : 'The name cannot be the same';
          return true;
        }
      }
    }
    self.dialogTips = '';
    return false;
  }
};

self.checkNodeHasChild = (path, node) => {
  if (node.children === undefined || node.children === null) {
    return false;
  }
  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i].path === path) {
      return true
    }
    else if (path.indexOf(node.children[i].path) === 0) {
      return node.children[i];
    }
  }
  return false;
}

self.curProjAddExpandedKeys = (uuid) => {
  if (self.curProjExpandedKeys.indexOf(uuid) < 0) {
    self.curProjExpandedKeys.push(uuid);
    self.saveProject()
  };
};

self.curProjRemoveExpandedKeys = (uuid) => {
  self.curProjExpandedKeys.splice(self.curProjExpandedKeys.findIndex(item => item === uuid), 1)
  self.saveProject();
};

self.sendCmd = (cmd, data, callback, id) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, data);
  window.GlobalUtil.model.socketModel.sendCmd(cmd, params, callback, id);
};

self.listProjects = (callback) => {
  self.sendCmd(window.GlobalUtil.constant.IDE_LIST_PROJECTS, {}, (dict) => {
    console.log(dict);
    if (dict.code === 0) {
      self.projList = dict.data;
      let lastAccessTime = 0;
      // sort the proj
      window.GlobalUtil.bubbleSort(self.projList, (a, b) => {
        return a.name > b.name;
      });
      // sort the proj end
      for (let i = 0; i < self.projList.length; i += 1) {
        if (self.projList[i].lastAccessTime > lastAccessTime) {
          lastAccessTime = self.projList[i].lastAccessTime;
          self.curProjConfig = self.projList[i];
        };
      };
      self.getProject();
      if (callback) {
        callback(dict);
      }
    };
  });
};

self.getProject = (projectName, callback) => {
  const params = {
    projectName: projectName === undefined ? self.curProjConfig.name : projectName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_GET_PROJECT, params, (dict) => {
    if (dict.code === 0) {
      self.codeItems = [];
      self.selectFilePath = null;
      self.curProjExpandedKeys = [];
      self.curProjConfig = dict.data.config;
      self.curProjTree = dict.data;
      if (dict.data.config !== undefined && dict.data.config.expendKeys !== undefined) {
        self.curProjExpandedKeys = dict.data.config.expendKeys;
        for (let i = 0; i < dict.data.config.openList.length; i++) {
          self.getFile(dict.data.config.openList[i], false);
        }
        let node = self.curProjTree;
        console.log('self.curProjTree:');
        console.log(dict);
        // sort node.children file and folder
        const sortByName = (children) => {
          window.GlobalUtil.bubbleSort(children, (a, b) => {
            return a.name > b.name;
          });
        };
        const sort_file_and_dir = (children) => {
          children = children || [];
          sortByName(children);
          let tempFiles = [];
          let tempFolders = [];
          for (let j = 0; j < children.length; j += 1) {
            const child = JSON.parse(JSON.stringify(children[j]));
            console.log(child);
            if (child.type === 'file') {
              tempFiles.push(child);
            }
            if (child.type === 'dir') {
              tempFolders.push(child);
              if (child.children.length > 0) {
                child.children = sort_file_and_dir(child.children);
              }
            }
          }
          return tempFiles.concat(tempFolders);
        }
        node.children = sort_file_and_dir(node.children);
        // sort node.children file and folder end
        while (true) {
          const check = dict.data.config.selectFilePath !== null ? self.checkNodeHasChild(dict.data.config.selectFilePath, node) : false;
          if (check === true) {
            for (let i = 0; i < node.children.length; i++) {
              if (node.children[i].path === dict.data.config.selectFilePath) {
                self.selectNode = node.children[i];
                if (self.projElTree) {
                  self.projElTree.setCurrentNode(self.selectNode);
                }
              }
            }
            break;
          }
          else if (check === false) {
            node = null;
            break;
          }
          else {
            node  = check;
          }
        }
        self.selectFilePath = dict.data.config.selectFilePath;
        if (callback !== undefined && callback !== null) {
          callback();
        }
      };
    };
  });
};

self.saveProject = (callback) => {
  const openList = []
  for(let i = 0; i < self.codeItems.length; i++) {
    openList.push(self.codeItems[i].path);
  }
  const params = {
    projectName: self.curProjTree.name,
    expendKeys: self.curProjExpandedKeys,
    openList: openList,
    selectFilePath: self.selectFilePath,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_SAVE_PROJECT, params, (dict) => {
    if (dict.code === 0) {
      if (callback !== undefined && callback !== null) {
        callback();
      }
    };
  });
};

self.createProject = (projectName) => {
  const params = {
    projectName: projectName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_CREATE_PROJECT, params, (dict) => {
    if (dict.code === 0) {
      self.listProjects();
    };
  });
};

self.deleteProject = (projectName) => {
  const params = {
    projectName: projectName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_DEL_PROJECT, params, (dict) => {
    if (dict.code === 0) {
      self.listProjects();
    };
  });
};

self.renameProject = (newName) => {
  const params = {
    oldName: self.curProjTree.name,
    newName: newName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_RENAME_PROJECT, params, (dict) => {
    if (dict.code === 0) {
      self.listProjects();
    };
  });
};

self.getFile = (filePath, save) => {
  const params = {
    projectName: self.curProjTree.name,
    filePath: filePath,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_GET_FILE, params, (dict) => {
    if (dict.code === 0) {
      for (let i = 0; i < self.codeItems.length; i++) {
        if (self.codeItems[i].path === filePath) {
          self.selectFilePath = filePath;
          return;
        };
      };
      self.codeItems.push({
        name: path.basename(filePath),
        content: dict.data,
        path: filePath,
        codemirror: null,
      });
      if (save !== false) {
        self.selectFilePath = filePath;
        self.saveProject();
        if (self.projElTree) {
          self.projElTree.setCurrentKey(self.selectFilePath);
        }
      }
    };
  });
};

self.createFile = (fileName) => {
  const params = {
    projectName: self.curProjTree.name,
    parentPath: self.selectNode.path,
    fileName: fileName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_CREATE_FILE, params, (dict) => {
    if (dict.code === 0) {
      const newPath = path.join(self.selectNode.path, fileName);
      self.getFile(newPath);
      self.selectFilePath = newPath;
      self.curProjAddExpandedKeys(self.selectNode.path);
      self.saveProject(self.getProject);
    };
  });
};

self.writeFile = (filePath, data, complete, line, column, callback) => {
  const params = {
    projectName: self.curProjTree.name,
    filePath: filePath,
    fileData: data,
    complete: complete,
    line: line,
    column: column
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_WRITE_FILE, params, (dict) => {
    console.log(dict);
    if (dict.code === 0) {
      if (callback) {
        callback(dict);
      }
    }
  })
};

self.deleteFile = (filePath) => {
  const params = {
    projectName: self.curProjTree.name,
    filePath: filePath,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_DEL_FILE, params, (dict) => {
    if (dict.code === 0) {
      for (let i = 0; i < self.codeItems.length; i++) {
        if (self.codeItems[i].path === filePath) {
          if (i > 0) {
            self.selectFilePath = self.codeItems[i - 1].path;
          }
          else if (i < self.codeItems.length - 1) {
            self.selectFilePath = self.codeItems[i + 1].path; 
          }
          self.codeItems.splice(i, 1);
          break;
        };
      };
      self.saveProject(self.getProject);
    }
  })
};

self.renameFile = (fileName) => {
  const params = {
    projectName: self.curProjTree.name,
    oldPath: self.selectNode.path,
    newName: fileName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_RENAME_FILE, params, (dict) => {
    if (dict.code === 0) {
      const name = path.basename(self.selectNode.path);
      const newPath = self.selectNode.path.substring(0, self.selectNode.path.length - name.length) + fileName;
      for (let i = 0; i < self.codeItems.length; i++) {
        if (self.codeItems[i].path === self.selectNode.path) {
          self.codeItems[i].path = newPath;
          break;
        };
      };
      self.selectNode.path = newPath;
      self.selectFilePath = self.selectNode.path;
      self.getFile(newPath);
      self.saveProject(self.getProject);
    };
  });
};

self.createFolder = (folderName) => {
  const params = {
    projectName: self.curProjTree.name,
    parentPath: self.selectNode.path,
    folderName: folderName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_CREATE_FOLDER, params, (dict) => {
    if (dict.code === 0) {
      self.curProjAddExpandedKeys(self.selectNode.path);
      // self.selectFilePath = path.join(self.selectNode.path, folderName);
      // self.saveProject(self.getProject);
      const selectNodePath = path.join(self.selectNode.path, folderName);
      self.saveProject(() => {
        self.getProject(undefined, () => {
          self.selectNodePath = selectNodePath;
        })
      })
    };
  });
};

self.deleteFolder = (folderPath) => {
  const params = {
    projectName: self.curProjTree.name,
    folderPath: folderPath,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_DEL_FOLDER, params, (dict) => {
    if (dict.code === 0) {
      self.getProject();
    }
  })
};

self.renameFolder = (folderName) => {
  const params = {
    projectName: self.curProjTree.name,
    oldPath: self.selectNode.path,
    newName: folderName,
  };
  self.sendCmd(window.GlobalUtil.constant.IDE_RENAME_FOLDER, params, (dict) => {
    if (dict.code === 0) {
      const name = path.basename(self.selectNode.path);
      const newPath = self.selectNode.path.substring(0, self.selectNode.path.length - name.length) + folderName;
      for (let i = 0; i < self.curProjExpandedKeys.length; i++) {
        if (self.curProjExpandedKeys[i].indexOf(self.selectNode.path) === 0) {
          self.curProjExpandedKeys[i] = self.curProjExpandedKeys[i].replace(self.selectNode.path, newPath);
        }
        // if (self.curProjExpandedKeys[i] === self.selectNode.path) {
        //   self.curProjExpandedKeys[i] = newPath;
        //   break;
        // };
      };
      self.selectNode.path = newPath;
      // self.selectFilePath = self.selectNode.path;
      // self.saveProject(self.getProject);
      self.saveProject(() => {
        self.getProject(undefined, () => {
          self.selectNodePath = newPath;
        })
      })
    };
  });
};

self.autocompletePython = (source, line, column, callback) => {
  const params = {
    source: source,
    line: line,
    column: column,
  };
  self.sendCmd(window.GlobalUtil.constant.AUTOCOMPLETE_PYTHON, params, (dict) => {
    if (dict.code === 0) {
      if (callback) {
        callback(dict);
      };
    };
  });
}

self.runPipCmd = (id, command) => {
  const params = {
    command: command,
  };
  self.sendCmd(window.GlobalUtil.constant.RUN_PIP_COMMAND, params, (dict) => {
    if (dict.code === 0) {
      if (dict.data === null || dict.data.stdout === undefined || dict.data.stdout === null) {
        for (let i = 0; i < self.consoleItems.length; i++) {
          if (self.consoleItems[i].id === dict.id) {
            self.consoleItems[i].run = true;
            self.consoleItems[i].output = '';
            self.consoleItems[i].resultList = [];
            break;
          };
        };
      }
      else {
        for (let i = 0; i < self.consoleItems.length; i++) {
          if (self.consoleItems[i].id === dict.id) {
            // 限制保存结果的最大30000行
            if (self.consoleItems[i].resultList.length > 30000) {
              self.consoleItems[i].resultList.splice(0, 100);
            }
            self.consoleItems[i].resultList.push(`${dict.data.stdout}`);
            // 限制只刷新选中的Console的结果
            if (self.selectConsoleItem.id !== self.consoleItems[i].id && window.GlobalUtil.model.robot.state.info.socketConnected) {
              break;
            }
            // 限制在运行过程中只显示20行结果
            if (self.consoleItems[i].resultList.length >= 20) {
              self.consoleItems[i].output = self.consoleItems[i].resultList.slice(self.consoleItems[i].resultList.length - 20).join('\n');
            }
            else {
              self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
            }
            if (dict.code === 1111 || window.GlobalUtil.model.robot.state.info.socketConnected === false || dict.code === 10086) {
              self.consoleItems[i].run = false;
              self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
            }
            // self.consoleItems[i].output += '\n' + dict.data.stdout
            const textArea = document.getElementById('console-' + self.consoleItems[i].id)
            if (textArea !== undefined && textArea !== null) {
              textArea.scrollTop = textArea.scrollHeight;
            }
            break;
          };
        };
      }
    }
    else {
      for (let i = 0; i < self.consoleItems.length; i++) {
        if (self.consoleItems[i].id === dict.id) {
          self.consoleItems[i].resultList.push(`${dict.data.stdout}`);
          self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
          // self.consoleItems[i].output += '\n' + dict.data.stdout
          const textArea = document.getElementById('console-' + self.consoleItems[i].id)
          if (textArea !== undefined && textArea !== null) {
            textArea.scrollTop = textArea.scrollHeight;
          }
          self.consoleItems[i].run = false;
          break;
        };
      };
    }
  }, id)
};

self.runPythonProgram = (id, filePath) => {
  const params = {
    projectName: self.curProjTree.name,
    filePath: filePath,
  };
  self.sendCmd(window.GlobalUtil.constant.RUN_PYTHON_PROGRAM, params, (dict) => {
    if (dict.code === 0) {
      if (dict.data === null || dict.data.stdout === undefined || dict.data.stdout === null) {
        for (let i = 0; i < self.consoleItems.length; i++) {
          if (self.consoleItems[i].id === dict.id) {
            self.consoleItems[i].run = true;
            self.consoleItems[i].output = '';
            self.consoleItems[i].resultList = [];
            break;
          };
        };
      }
      else {
        for (let i = 0; i < self.consoleItems.length; i++) {
          if (self.consoleItems[i].id === dict.id) {
            // 限制保存结果的最大30000行
            if (self.consoleItems[i].resultList.length > 30000) {
              self.consoleItems[i].resultList.splice(0, 100);
            }
            self.consoleItems[i].resultList.push(`${dict.data.stdout}`);
            // 限制只刷新选中的Console的结果
            if (self.selectConsoleItem.id !== self.consoleItems[i].id && !window.GlobalUtil.model.robot.state.info.socketConnected) {
              break;
            }
            // 限制在运行过程中只显示20行结果
            if (self.consoleItems[i].resultList.length >= 20) {
              self.consoleItems[i].output = self.consoleItems[i].resultList.slice(self.consoleItems[i].resultList.length - 20).join('\n');
            }
            else {
              self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
            }
            if (dict.code === 1111 || window.GlobalUtil.model.robot.state.info.socketConnected === false || dict.code === 10086) {
              self.consoleItems[i].run = false;
              self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
            }
            // self.consoleItems[i].output += '\n' + dict.data.stdout
            const textArea = document.getElementById('console-' + self.consoleItems[i].id)
            if (textArea !== undefined && textArea !== null) {
              textArea.scrollTop = textArea.scrollHeight;
            }
            break;
          };
        };
      }
    }
    else {
      for (let i = 0; i < self.consoleItems.length; i++) {
        if (self.consoleItems[i].id === dict.id) {
          self.consoleItems[i].resultList.push(`${dict.data.stdout}`);
          self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
          // self.consoleItems[i].output += '\n' + dict.data.stdout
          const textArea = document.getElementById('console-' + self.consoleItems[i].id)
          if (textArea !== undefined && textArea !== null) {
            textArea.scrollTop = textArea.scrollHeight;
          }
          self.consoleItems[i].run = false;
          break;
        };
      };
    }
  }, id)
};

self.stopPythonProgram = (id, stopX) => {
  const params = {
    program_id: id,
    stopX: stopX === undefined ? true : stopX,
  }
  self.sendCmd(window.GlobalUtil.constant.STOP_PYTHON_PROGRAM, params, (dict) => {
    if (dict.code === 0) {
      if (dict.data === null || dict.data.stdout === undefined || dict.data.stdout === null) {
        return;
      }
      for (let i = 0; i < self.consoleItems.length; i++) {
        if (self.consoleItems[i].id === dict.id) {
          self.consoleItems[i].resultList.push(`${dict.data.stdout}`);
          self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
          // self.consoleItems[i].output += '\n' + dict.data.stdout
          const textArea = document.getElementById('console-' + self.consoleItems[i].id)
          if (textArea !== undefined && textArea !== null) {
            // textArea.scrollTop = textArea.scrollHeight;
            setTimeout(() => {
              textArea.scrollTop = textArea.scrollHeight;
            }, 200);
          }
          self.consoleItems[i].run = false;
          break;
        };
      };
    }
    else {
      for (let i = 0; i < self.consoleItems.length; i++) {
        if (self.consoleItems[i].id === dict.id) {
          self.consoleItems[i].resultList.push(`${dict.data.stdout}`);
          self.consoleItems[i].output = self.consoleItems[i].resultList.join('\n');
          // self.consoleItems[i].output += '\n' + dict.data.stdout
          const textArea = document.getElementById('console-' + self.consoleItems[i].id)
          if (textArea !== undefined && textArea !== null) {
            // textArea.scrollTop = textArea.scrollHeight;
            setTimeout(() => {
              textArea.scrollTop = textArea.scrollHeight;
            }, 200);
          }
          self.consoleItems[i].run = false;
          break;
        };
      };
    }
  }, id);
}

self.getConfig = (callback) => {
  const params = {};
  self.sendCmd(window.GlobalUtil.constant.IDE_GET_CONFIG, params, (dict) => {
    if (dict.code === 0) {
      self.isReady = dict.data.isRunning;
      if (callback) {
        callback(dict);
      };
    };
  });
}

export default self;
