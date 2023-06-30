import { Button } from "@/components/MuiWrappers/Buttons";
import styles from "@/styles/offersTable.module.css";
import { formatPrices, getTimeElapsed } from "@/utils/functions";
import useDialogProps from "@/utils/hooks/useDialogProps";
import { ArrowDownIcon, RealtorMale } from "@/utils/icons";
import { Bid } from "@/utils/types/listing";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import DialogWrapper from "./Dialog";

function getCustomerFeedbackCell() {
  return "Ei vielä arvioita";
}

function Row(props: {
  row: Bid;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBid: React.Dispatch<React.SetStateAction<Bid | null>>;
}) {
  const { row, setOpen, setSelectedBid } = props;

  const getTimeElapsedCellTextColor = (row: Bid) => {
    const timeElapsed = getTimeElapsed(new Date(row.updatedAt));

    if (timeElapsed.includes(" päivää")) {
      const days = Number(timeElapsed.replace(" päivää sitten", ""));
      if (days > 2) {
        return "#344054";
      }
      return "#C4320A";
    }

    return "#027A48";
  };

  const rowOnClick = () => {
    setOpen(true);
    setSelectedBid(row);
  };

  const getRealtorTitles = () => {
    if (row.Realtor.licencedAgent) {
      return row.Realtor.company + ", LKV";
    }
    return row.Realtor.company;
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={styles.tableRow}
        onClick={rowOnClick}
      >
        <TableCell />
        <TableCell component="th" scope="row" className={styles.tableCell}>
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <RealtorMale width={35} />

            <div>
              <p className={styles.boldedTableText}>
                {row.Realtor.firstName + " " + row.Realtor.surname}
              </p>

              <p style={{ marginTop: "5px" }}>{getRealtorTitles()}</p>
            </div>
          </div>
        </TableCell>
        <TableCell align="left" className={styles.tableCell}>
          {formatPrices(row.price)}
        </TableCell>
        <TableCell align="left" className={styles.tableCell}>
          {row.comission}€
        </TableCell>
        <TableCell
          align="left"
          className={styles.tableCell}
          style={{
            color: getTimeElapsedCellTextColor(row),
            fontWeight: 550,
          }}
        >
          {getTimeElapsed(new Date(row.offerUpdated))}
        </TableCell>
        <TableCell align="left" className={styles.tableCell}>
          {getCustomerFeedbackCell()}
        </TableCell>

        <TableCell>
          <Button sx={{ fontSize: "18px", textTransform: "capitalize" }}>
            Katso
          </Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface Props {
  bids: Bid[];
  showAcceptedBidToast: () => void;
  refetchListing: () => void;
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: any, orderBy: any): (a: any, b: any) => number {
  if (orderBy === "updatedAt") {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function sortTable(
  array: readonly Bid[],
  comparator: (a: Bid, b: Bid) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as any);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

type Order = "asc" | "desc";

export default function CollapsibleTable({
  bids,
  showAcceptedBidToast,
  refetchListing,
}: Props) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("comission");
  const headerToKeyMap = {
    Kiinteistönvälittäjät: "firstName",
    Pyyntihinta: "price",
    Välityspalkkio: "comission",
    "Tarjous on jätetty": "updatedAt",
    "Asiakkaiden arvioita": "Asiakkaiden arvioita",
  };

  const [selectedBid, setSelectedBid] = React.useState<null | Bid>(null);

  const { open, setOpen } = useDialogProps();

  const TableCellHeader = ({
    title,
    sortable = true,
  }: {
    title: string;
    sortable?: boolean;
  }) => {
    const renderArrowDownIcon = () => {
      if (!sortable) {
        return false;
      }
      return headerToKeyMap[title as keyof typeof headerToKeyMap] === orderBy;
    };
    return (
      <TableCell
        className={styles.tableHeader}
        style={{
          cursor: sortable ? "pointer" : "default",
        }}
        onClick={() => {
          if (!sortable) return;
          if (
            headerToKeyMap[title as keyof typeof headerToKeyMap] === orderBy
          ) {
            setOrder(order === "asc" ? "desc" : "asc");
          } else {
            setOrderBy(headerToKeyMap[title as keyof typeof headerToKeyMap]);
            setOrder("asc");
          }
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderArrowDownIcon() ? (
            order === "asc" ? (
              <ArrowDownIcon width={20} fill={"black"} />
            ) : (
              <ArrowDownIcon
                width={20}
                fill={"black"}
                style={{ transform: "rotate(180deg)" }}
              />
            )
          ) : null}
          {title}
        </div>
      </TableCell>
    );
  };

  if (bids.length === 0) {
    return (
      <Box sx={{ marginTop: "30px" }}>
        Kun saat ensimmäisen tarjouksen kohteeseen, se ilmestyy tänne.
      </Box>
    );
  }

  const isBidAccepted = bids.find((bid) => bid.bidAccepted === true)
    ? true
    : false;

  return (
    <>
      {open && (
        <DialogWrapper
          open={open}
          setOpen={setOpen}
          bid={selectedBid}
          showBidAcceptedToast={showAcceptedBidToast}
          refetchListing={refetchListing}
        />
      )}

      {isBidAccepted && (
        <Box sx={{ marginTop: "30px", marginBottom: "30px" }}>
          Tarjouskilpailu on päättynyt. Voit jatkaa tarjousten vastaanottamista
          ja vertailua käynnistämällä kilpailutuksen uudelleen.
        </Box>
      )}
      <Paper
        sx={{
          width: "100%",
          pointerEvents: isBidAccepted ? "none" : "default",
          opacity: isBidAccepted ? 0.5 : 1,
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <caption></caption>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell />
                <TableCellHeader
                  title={"Kiinteistönvälittäjät"}
                  sortable={false}
                />
                <TableCellHeader title={"Pyyntihinta"} />
                <TableCellHeader title={"Välityspalkkio"} />
                <TableCellHeader title={"Tarjous on jätetty"} />
                <TableCellHeader title={"Asiakkaiden arvioita"} />

                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortTable(bids, getComparator(order, orderBy)).map((row) => {
                return (
                  <Row
                    key={row.id}
                    row={row}
                    setOpen={setOpen}
                    setSelectedBid={setSelectedBid}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
