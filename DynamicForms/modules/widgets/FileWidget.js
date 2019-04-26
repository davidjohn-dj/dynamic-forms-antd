import React, { Component } from "react";
import PropTypes from "prop-types";

import { dataURItoBlob, shouldRender, setState } from "../../utils";

function processFile(file) {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = event => {
      resolve({
        dataURL: event.target.result,
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}

function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}

function FilesInfo(props) {
  const { filesInfo } = props;
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <div className="ant-upload-list ant-upload-list-text">
      {filesInfo.map((fileInfo, key) => {
        const { name, size, type } = fileInfo;
        return (
          <div className="ant-upload-list-item" key={key}>
            <strong>{name}</strong> ({type}, {size} bytes)
          </div>
        );
      })}
    </div>
  );
}

function extractFileInfo(dataURLs) {
  return dataURLs
    .filter(dataURL => typeof dataURL !== "undefined")
    .map(dataURL => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        name: name,
        size: blob.size,
        type: blob.type,
      };
    });
}

class FileWidget extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    const values = Array.isArray(value) ? value : [value];
    this.state = { values, filesInfo: extractFileInfo(values) };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onChange = event => {
    const { multiple, onChange } = this.props;
    processFiles(event.file).then(filesInfo => {
      const state = {
        values: filesInfo.map(fileInfo => fileInfo.dataURL),
        filesInfo,
      };
      setState(this, state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });
  };

  // beforeUpload(file) {
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //   }
  //   return isLt2M;
  // }

  fileRequest = (event) => {
    const { multiple, onChange } = this.props;

    processFiles(event.file).then(filesInfo => {
      const state = {
        values: filesInfo.map(fileInfo => fileInfo.dataURL),
        filesInfo,
      };
      setState(this, state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });

    var reader = new FileReader();
    reader.readAsDataURL(event.file);
    const that = this;
    reader.onload = function () {
      that.setState({
        imageUrl: this.result,
        image: event.file
      });
    };

    return {
      abort() { }
    }
  }

  render() {
    const { multiple, id, readonly, disabled, autofocus } = this.props;
    const { filesInfo } = this.state;
    return (
      <div>
        <p>
          <Upload
            name='file'
            type="file"
            defaultValue=""
            disabled={readonly || disabled}
            onChange={this.onChange}
            autoFocus={autofocus}
            multiple={multiple}
            id={id}
            ref={ref => (this.inputRef = ref)}
            customRequest={(e) => this.fileRequest(e)}
            showUploadList={false}
          // beforeUpload={this.beforeUpload}
          >
            <Button>
              <Icon type="upload" /> Upload File
            </Button>
          </Upload>
        </p>
        <FilesInfo filesInfo={filesInfo} />
      </div>
    );
  }
}

FileWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  FileWidget.propTypes = {
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    autofocus: PropTypes.bool,
  };
}

export default FileWidget;
