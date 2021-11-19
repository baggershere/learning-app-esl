import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../redux/react-redux-hooks";
import { connect } from "react-redux";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableFooter,
} from "@material-ui/core";
import { format } from "date-fns";
const RecentList = ({ child, game, data, state }) => {
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, currentData.length - page * rowsPerPage);

  const extractRecentScores = () => {
    const scores = state.profile.recentScores;
    const filteredScores = scores.filter(
      (score) => score.game_name === game && score.child_name === child
    );
    setCurrentData(filteredScores);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  React.useEffect(() => {
    extractRecentScores();
    console.log(currentData);
  }, [state, game, state.user.selectedChild]);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game Type</TableCell>
              <TableCell>Game Score</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow>
                    <TableCell>{row.game_name}</TableCell>
                    <TableCell>{row.game_score}</TableCell>
                    <TableCell>
                      {format(new Date(row.date_attempt), "dd/MM/yyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(row.date_attempt), "HH:mm")}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[1, 5]}
                count={currentData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default connect((state) => {
  return {
    state: state,
  };
}, null)(RecentList);
