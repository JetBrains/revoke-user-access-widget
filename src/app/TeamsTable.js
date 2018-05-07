import React, {Component} from 'react';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

import 'file-loader?name=[name].[ext]!../../manifest.json';
import Selection from "@jetbrains/ring-ui/components/table/selection";
import PropTypes from "prop-types"; // eslint-disable-line import/no-unresolved

class TeamsTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    data: PropTypes.array,
    columns: PropTypes.array,
    selection: PropTypes.instanceOf(Selection)
  };

  constructor(props) {
    super(props);
    this.state = {
      selection: new Selection()
    };
  }

  render() {
    const {selection} = this.state;

    return (
      <Table
        columns={[{
          id: 'project',
          title: 'Team',
          getValue(team) {
            return (team.project &&
              <Link href={`projects/${team.project.id}`} target="_blank">{team.project.name}</Link>
            );
          }
        }]}
        selection={selection}
        onSelect={selection => this.setState({selection})}
        {...this.props}
      />
    );
  }
}

export default TeamsTable;
