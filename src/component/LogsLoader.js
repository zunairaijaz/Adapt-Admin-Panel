

import { Skeleton } from '@mui/material';

function LogsLoader({ rowsNum }) {
    const loadingRows = Array.from({ length: rowsNum }, (_, index) => (
      <tr key={index}>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
        <td>
          <Skeleton variant="text" />
        </td>
       
      </tr>
    ));
  
    return <>{loadingRows}</>;
  }
  export default LogsLoader;