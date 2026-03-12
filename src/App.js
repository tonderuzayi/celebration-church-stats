import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// ── LOGO (base64) ─────────────────────────────────────────────────────────────
const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASMAAACMCAYAAAA3Hc+iAAAACXBIWXMAAAsSAAALEgHS3X78AAAXi0lEQVR4nO2dUZabOLPH/8nJe/ddQZMVxLOCkBXEefDlsT0buHhWELKCaVYQ+pGPh3GvIPQKYq9g7BV87RXkPqiIMZaEJIShcf3O6TMZbKQyiKJUqiq9+fXrFxjGN1FcBAACADMALwB2ebooBxSJGTlvWBkxPYniYglgBeCD5OMDgIc8XSSXlIl5HbAyYrwQxUUIIANwZ/D1xzxdLPuUh3l9vB1aAOb1Q9bQD5gpIgC4p3MY5jesjJhOkFL57nDqyrMozCuHlRHjTBQXc7gpIkDuU2KuGFZGjBNRXNxC+IgYxgusjBhXVgBuhhaCmQ6sjBhXlh3P3/oQgpkOrIwYa6K4mMF85UxF6UEUZkKwMmJcmHlo48FDG8yEYGXEuBB0PP8pTxc7D3IwE+Ld0AIwV8nnKC5+QaSHbADs6K+EyGHbDSUYMxycDsJYQ/FF//TYRaWkSgAlJ9heB6yMGGPIcb2kv0su6x8gFNM6TxeZ7Au1KgEhHdoAeGFF9npgZcS00pKJf2kOANYAkjxd7EhBPgD4qDnnCRpFxowDVkaMElJCCbov4/fFE4QlZGql7QGs8nSx7k0ixhlWRswZ5BN6wHiVkIoniBSVF/r/WwBz+qsrLC5hMkJYGTG/Ib9LBv2UxwdbiNWzDYTi2NQ+2+Tp4qV5Ak3HbmuHQgBfa/+vVDCUR7dqfH8LIJT1xQwDKyMGABDFxQpiStaHY/oJwgG98eVQpmJuP2qHPrW1TQqtxPE3soU0IlgZXTlkNazh3xp6hHAa9+afoVilii8mfZFC+ml7HtM/HIF9xdCDuYE/RbQH8A3A/+TpYnmBh/yx9m+jYm15utg0zlv6FIhxhyOwrxRyUmfwMy07QCy1XzrfLMHROX0xiovMcNq1BnBP//7cj2iMLWwZXSG0ZP8P/CiiFEAwgCICpY3Ma4fuo7hY09RTR9ibUIwz7DO6MjrUrG5yADAfQ4QzObPXOCrXA0RoQtbMcyNH/d+1Q9s8XfioQsB0hJXRFeFREY1uWVwTlrCHCCMAROmTpjXIDuyRwMroSpAshbsyOkVUh37nCu2+oANENHbWt0yMGayMrgBJfI0ro1ZEdchvNIewhurTsB2OSbej/x3XBCujiUMPZYnuSa6vRhExrxNeTZs+D+iuiCpnNSsipjdYGU0YiiW6b/1iO0uuvsj0DU/TJgpNz3bo7id6ytPFvP1rDNMNtoymSwI/QY1GaRYM0xW2jCYIxdz864FpzmpnLgZbRtMkGVk7DNMKW0YTw6NVxL4i5qKwZTQ9Ek/tZJ7aYRgj2DKaELSC9l8fbeXp4o2PdhjGFLaMpsXSUzvPntphGGNYGU2Lpad2Nu1fYRi/sDKaCOS49rXJIqd9MBeHldF08LnyxcqIuTisjKZD6LGttrKtDOMdVkbTIRxaAIbpAiujCUD+Ip+bLwYe22IYI1gZTQPfBeVDz+0xTCusjKaBb2V0R9YWw1wMVkbTIOihzaSHNhlGCSujaRD00OY9FfJnmIvAyojRkRnszsowXmBlxOj4AKBkhcRcAlZGTBsfAGzGPGWL4uI2ioskiouHoWVh3Hk3tADMq+AOwM8oLr4BeBjLlkVksa3o7wbA47ASMV1gy4ix4SuElbQcUogoLoIoLjKI2k1fIRTRFrx5wKuGi6tNgCguSgAfL9ztHmKDyOxSlhJNFVc43wuOd7udAKyMJsBAyqjOE4A1eti/noIv5xC1mmQlUlgRTQRWRhOAHLfx0HIQWwAlRIG2TZ4urAq1kfUzg0hJCSH8Vbq+WBFNBHZgT4MxPYwfULNgorgAgANOq0dW/66v0AXQK54mTxDbbo/ptzMdYGU0DUoIR+5YucHpNLLrlPJbni6Sjm0wI4OV0TS4lprVewhrqBxaEMY/vLQ/AWiqsh9ajp5JAcxYEU0XtoymQ4nzJe8p8AxhDe2GFoTpF1ZG02GNaSmjR4ho72uZgl49vLQ/IaK4eIF7+dktxKrckPFKFw+kZMYDW0bTopN1lKeLkIIMVxCBhjZL7a7sIeTO2Aq6btgymhBRXIQAfnRo4n3dN1OLfg7pz0fR/wOEf6sEULICYipYGU2MKC52cLdo/srThbIMB0VHBxDBigGOFSaDRp/VlA8QYQcvOEZk7xxlYyYOK6OJQRn13x1P3+fpIvAnDcOYw3FGEyNPFxncY47uhi4PwlwvrIymSdLh3KUnGRjGCp6mTZQoLjaQl9ww4UueLtY+5WGYNtgymi5dqh4+cBF+5tKwMpoolMOVOp5+By7hylwYVkbTJoG7M/vrmHcEYaYHK6MJQykVyw5NrHm6xlwKVkYTh6Zrfzmefgcg8yYMw2hgZXQFUFS1655in2lbIIbpFVZG18MKIk3DhfsoLtihzfQKxxldEeT/KeEef/QnRXgzjHfYMroiyKEdwt1C+h7FReJNIIapwZbRFeLBQnrM08XSm0AMA1ZGVwsppAzAZ8cmngHMuSIj4wtWRldOx91oDxAKqfQnEXOtsDJiEMXFHMJKcq3kmAJI2EpiusDKiAHwu8RsBveC/LzBItMJVkbMCVRc7QHuVtITgBWXl2VsYWXEnEHO7RWArx2aeYSYuu28CMVMHlZGjBKauiXotjkkb8bIGMHKiGmlZikt4b7zyBbCJ7Vma4mRwcqIsYJW3qq/LrvXlhDbF+3Y6c0ArIyYDlDxtWqTxxkclVOeLt54FIt5pbAyYrxBPqYAQjHd0p+sWmS1qSMgNnbk4v8MKyOGYcYBZ+0zDDMKWBkxDDMKWBkxDDMK3g0twFih2JpqCbukOtKjo7aiFUCkYXCy6oigcbSEWHHcQcRZlcNJNF68KCN6IG4hLniTDWj1ZOwPSk0BhTiNo/kMka81CqhUL4eQsepBiDsIiKmmRkBdJ9KnIY8xFEsXYj7leCkjGgJt3pojYtzRXGxh7g567Es55ICeoD4La7Rxb1DwYYrdIjnYS6OKuH4exQXJUein2KljKK4CCEeCNfqgHcQeU73pJhWI1BKK3TLvboU/wwtAGMOveR05VjmGJG1PQaMHNhRXARRXJQAfkCviJ7pz6Tg+x2Af6jS4JB02VPskqQQlRWZ10HQ8jnv1NugNeiR9stKIDc39xAPszT5sZbH1GZ5vB/aZG2r4zOGlAWD0h7f8nSRXE4iRkcUFy9QT6k/sSP7FO00jXYSlSkSoykWfb4m6yeDejeKwU3WPF1kZP39O6QcOmgBICGf3WuYWr4qyOFcjcMXiMqVXRZdVgC+S44/syI6RzpNi+LiNoqLDeQD/gnAzMbXQ7VsQqinb6MwWck6c91T7JJkQwswUTIIP89HCHeELK/OGFox+4LjmDoA+Abx8mUaqCyjNeRWjPN+WXm6eCEHeClpu9NN98yoww+YfqApsOs+ckqq2YHvdqfImWVEUzPZKsBT1437yOSVtTEKy4i5asb0QrxKTpQROZxVPqKljw5pyvYaVq+Y64KnTgPzWxnVdhiV0dWR1yTB6TJ16bFthrGilrLBDEjdZ7SCfBnSu+c/Txc7ChmoVhqc26cVkACnZnYJUc5059puH5DPLMAxBqUqMtZ7qgw9cDOcpuyU8HCdaHUvBHCryuGrfSeA+N1WtbBrKUfVfytKAC+uBf/pulS4QFQ73f8QYoOCTve7VsgurB3e0Z/X8WQiN8kzw/E5rFLAStN+3vz69au6ITvIb8iXEURJn0ADc4X2Osx7CGvP+ObT8v6Zz8w1zsgian0LIWdm2OYPyUdncUaG/Rv33WhbFkf2V10h1dJtmtP/A0R4iLTPmrUyh9nGkgcIR7HR9kj08CyhfgkDirFfUwRAy4OvyCN0Wgiifqtx35a6VG2AkLkoJlO5KT4v0chjfF8qZbQC8Lfk832eLgIj6S8A3YwH2KejaAd+o48SHpRRLWbFdofW1p1ZTZRRbdptc6221LfUymhkoIeQP8R1GWSJonUOAILmwxLFRQK9kmgjzdPFSvVhFBdrmF2XA47lcXWrbX9U16yRtxlCPdsIDfqv5FUpdBMOEC+axKCPutwy5fJbbhqDmeJ7Kjm0z2DlM1LduNFYRPQW3kA+iJ4hnOKPkMcJ3UAkJ2a9CViDlPtPnCuiA4SsKUS81l5y+h2AH/TGce1/BmHp2irtDwBKOl9GBvHS+owWRWGgiECfhY3zEogIc915WxxTj2TEUVxs6AGTYXpdbnCMO9It+zenjUbXyAR66HeQK6L6dZCNJZAMX6O4KDXXAxD39jv1o1UwNDZ/tH1PIsd33bh+R5pc1Whp0Vlv0A9oRrIeIN4WZ1MwjQV1H8UFuoYo6FBErSvfCjTYHnA+2L+TrGfntPQ/hxhYrg/CDYRCCiUWkpFFQde/NJRhhtOXntKigQgYPLnf9IAlAOLGdz9AXNelgQxdqV+nBPKoa2sU4x4Q1yFrTntaZg4fcbyvsmmbqRtDJZMp36O42Ais77fQL2mWHTr1gkYRhXm6SKQXNk8XezxdzCGPsB96Qu2lALSuWmSFqiAaoa9RGhvNxn9osk5OFJrO2AeFT043pNrmr8aWUp5aPquLss7cYaRg8KYumH2WveQikaC6YzjdhywPOB8+jQ+xLqTi+tGzHRglmUI/aG+in8bqp3gEKuWk6URrI+GTpM1Nd76HGuLUyIytNtgKbOPS/hHoKqmzP4L4oV1wb7WygnrKd3ZO3UJtRtg+SbxLJMdc3jWz+7iUpUlPOw0XWneJ4aNHG1mFqoVPMrv41l8C+Xe3fB9i/MOLF8TbLqBccAzETybFHl1ghjbUNCIsxsG0TwiCwGV+q7571rav02NVEdYbeDrIVPuv5O5no0tVChXPTlqXk2N5xIIaK4zaKM7PtlKZzqjeYa4lhVzm+QDijW6eZdejBUsV0jdL6b0JTJ9m9Ljs0m2k+c3nR6NqTUZp+UaeMAstOfSK7SAfbtIVasFifLCXHdraN0MOUdBMFgHtsmPI8B5/V1jXFJE8Xa1otMlbmdJ+dHc1QK6tLzw5UysFZjlxfoyt0aLK07N/YqNFVegxsOvWM9KbQ0rnpjwvRvpNGJ+uPHlKZ1RXQioQJtxBy2kZqy9h3UQJRXKg+tp3mXOwhJiW+Rrdpt8pJf+nZQaiQo+v1VF0faX8t9HZv3+F8KXZQNLEmNzgPbOvCwcNNVr1R79C+NGqDysHcZNexn2fIlWJg2U5XOVqJjvXAV2iPaRra/2mKjxeSUNXvtw6M7VNBv4V64Aw1zw4u1I+P1bTAQxttHGA+fev60KkGWmDZTtlNDDVRXMwoyn2H9rSRisH8nyNBOS4sp+CdAjnbeAchqEwj30RxEbia/R1QXZwDhPOs64B6gWX5Cg2h4niVqtKVHYSspr+567XZwN1h3Ru15NMV1FZ8Sv/1aT1fDE+LKVJyUbJH9bHNFHzXXRo1lTJSMetbAAtaM49HhDIy9ZVSWn7fiyVCsWZL6Kcvj6DyFBZ+OmaEvINwbqnCxucYT+Z+MLQAFoQYQV7fUHT1xVFoxwPUVpB1narXTM8zlNFcv3e52LVjC7m33TXgrQ+CoQW4Yi7iADao27OHsIIyz10PHoeUp4tSM5XqbYbiYRHHG1Wckcq/ceMzh8uQneL44ANGgupGhpcUwmO/svP3F7Q+1lArohQily3TnB869iv1m/Tpx7Gkr7Hfq0PalirOaA311s5L9LRpYK32T73in3IZMoqL2Zg0OdSKs68l2ja6pj3Izi87tmkE+XtU1+3PHqyhMaIKrZijQ0CsJu1jTM+SsIxaclg+9mEdRafbIt2AtD8pG1Vyn3c5OlKqPhjAogSADwYZ6lIi9SaGvfsMazFDMlILRTRG69kGlXL44JhHVqG6LmPxBwOopYPQSpXKbHtwHeQyDNI0SsXxpU85ukKKU3XNkguKUif0eN6hSz0fC+ZQxwslJg3Qw+p7h49LK7dM89myQ7uh4viQyihoHmjmpi0VJ97Ar+AJ9FHfmUYO1WdGRHERdHzLNMkUx++oAJkzFOBnq3yXjt3JFiv6zuurCBTHny38VV0WW1R9dFJGtjl9LS83ZW0pA5aSY06VADxy9vyfKCOKjVGVFP3oo6A9TV+0gWn0NlbdlM+uUyDyS/wLYGM7UFqK1KtIHJJMEcXFLV3rn9AXyJdhXRpCUQbFOXDTs7I3pYviV02Puq4muyiPRHH8Bg6/kZ4VmcWo6keH9e+xUaBnWfs0XVOVk7iP4uKsNrKFYEuoY5qaA0J34bW7DEj6DaicbJUvpisapnKiqpIpd1Ar8Kq4vbEyqZXrrJTDB9iHNWSW35cpHWl98QaqaxVY9q/C6LrRS6ZLfqXqd97orNsoLpZRXLxoxmKgOK78XeQfU2XZf7VZ4dO4Q761lCNW9eGSjKz8rc2XlrSECJUG1dW32dgue0anO8g22UoKra81MgBCIa11b2FSQgnOU16kb/2W36R8S5ICVw2gGwA/o7jQFtcnWTMIa6h+012KpRlbsfQgNVNAntoqarYoWFuLQreCqrUGSP62pOQ2eUrNZ343ZaB7VQUL30BtQYaK4zct12+p+Wxt8nKL1DvlPhtkMoSadpWf2bbV/OzNr1+/lN80KMz9DLFlSqZpo8op0i13/yUb/LUL2qaRt/S9SqHdQvxQ1Xlnhc0N+tIWhjcoQF7xjNPBH0C8PWT9HiBia3aNvkK0F+QHhDJfqSwcxf012kQgUmxcQFhtmkDt7aC2bs7GRyTflke1NA6IOKWdSsm29A8cN3SUrTqeFbin8fBT015bUf4l1C/vA4TlqvotMwjruCln672N9LtLA+LlaGqxtrV1siGDVhlRgyHMdo58xnGvb8CsnhDQ8uMsFJIJB4j6vSeWhubmGZ3faKeEn1Ud5e6uFsoIOCYY12UOId6+zXtqMlgDaq8tlkp7rSTtziHfoaPeXnUtZAphC/G7/tvSlXRnDIP+VZxdM7KkEpi9mJaqKVOLQgLEw7zG8UUcQjxzsmRnk3s7h9k2UyY7z4QkW1tbv3dQblVGtcYTdNtyWIb2zd3o/wHdMrKlN54ern8t29Jt4XMLcRO6BD62WTQhTpXRN4gBmXTo9wkthfwj9RY6OqRWr6L9Jdw2CPwteyTfRLOO7t61ndtEpohsx6nU+q21Z/qi1KHdmoj6sVXGSrkdFfsXXdnZE6gU6C3E1jamxb5kHCAetj/ydGGzi8UKYnsb274fIfa/UtVUfoF+l4smB2h8DLnYVDCEqOWs8iOpeIKYQrZdl/pne7o3JfX7ybLfZ+pzbnAvXmAXtbuHRQR3br8BYrWJYl32FdRBs486fwn5Sts2qAS1/y1PF7KtlkpN/zI20CSr5mJ7pxnEc2ebvlE9ZyarcDvL9nVy27a1B7AztoyakAUQQpiFMwjTuW4+183qHf1746O0RnSsbzPD0edyU+vzBWJQGNctsnDMbWziM+jNFtLfLY6Wyx7HaW0Ju7pFlc9mBoVvhvqd1/qt7ssWp9fHRrlUbYeGX7W6Vo0+Ktmr8XWD4zXbACg10+VbCH9SCDEVbfVtNs4PIJRave8t9b1Gy72i/o38KrbPg2Q8Ncf+DuLelraZ/j7ltmkLNE7+H1t89HAQj7h2AAAAAElFTkSuQmCC";

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const BRANCHES = ["Harare Central", "Borrowdale", "Chitungwiza", "Bulawayo", "Mutare"];

const USERS = [
  { id: 1, name: "Admin User", email: "admin@celebrate.org", role: "admin", branch: null, password: "admin123" },
  { id: 2, name: "Grace Moyo", email: "grace@celebrate.org", role: "capturer", branch: "Harare Central", password: "pass123" },
  { id: 3, name: "Tendai Muto", email: "tendai@celebrate.org", role: "capturer", branch: "Borrowdale", password: "pass123" },
  { id: 4, name: "Blessing Dube", email: "blessing@celebrate.org", role: "capturer", branch: "Chitungwiza", password: "pass123" },
];

const genStats = (branch, dateStr, weekOffset = 0) => ({
  id: `${branch}-${dateStr}`,
  branch, date: dateStr,
  attendance: {
    adults: 120 + Math.floor(Math.random() * 80) - weekOffset * 3,
    vip: 8 + Math.floor(Math.random() * 10),
    children: 45 + Math.floor(Math.random() * 30) - weekOffset * 2,
  },
  alterCall: {
    salvations: 3 + Math.floor(Math.random() * 8),
    rededications: 2 + Math.floor(Math.random() * 5),
  },
  offerings: {
    tithe: 1200 + Math.floor(Math.random() * 800) - weekOffset * 50,
    offering: 450 + Math.floor(Math.random() * 300),
    firstFruit: 200 + Math.floor(Math.random() * 150),
    compassion: 80 + Math.floor(Math.random() * 60),
    special: { label: "", amount: 0 },
    other: { label: "", amount: 0 },
  },
  highlights: "",
});

const SEED_STATS = [
  ...BRANCHES.map(b => genStats(b, "2026-03-08", 0)),
  ...BRANCHES.map(b => genStats(b, "2026-03-01", 1)),
  ...BRANCHES.map(b => genStats(b, "2026-02-22", 2)),
  ...BRANCHES.map(b => genStats(b, "2026-02-15", 3)),
  ...BRANCHES.map(b => genStats(b, "2025-03-09", 8)),
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const totalAttendance = s => s.attendance.adults + s.attendance.vip + s.attendance.children;
const totalOfferings = s => Object.entries(s.offerings)
  .filter(([k]) => !["special", "other"].includes(k))
  .reduce((a, [, v]) => a + v, 0)
  + (s.offerings.special?.amount || 0)
  + (s.offerings.other?.amount || 0);

const fmt$ = n => `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (a, b) => b === 0 ? null : (((a - b) / b) * 100).toFixed(1);
const Arrow = ({ val }) => val === null ? null : (
  <span style={{ color: val >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 12 }}>
    {val >= 0 ? "▲" : "▼"} {Math.abs(val)}%
  </span>
);

// ── THEME ─────────────────────────────────────────────────────────────────────
const C = {
  blue: "#4A6FA5",
  blueDark: "#2d4a73",
  blueLight: "#6B8DBB",
  bluePale: "#E8EFF8",
  accent: "#F0B429",
  bg: "#F5F7FA",
  card: "#FFFFFF",
  border: "#DDE3ED",
  text: "#1a2744",
  muted: "#6B7FA3",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lato:wght@300;400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Lato', sans-serif; background: ${C.bg}; color: ${C.text}; }
  h1,h2,h3,h4 { font-family: 'Nunito', sans-serif; }
  input, select, textarea { font-family: 'Lato', sans-serif; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f0f0f0; }
  ::-webkit-scrollbar-thumb { background: ${C.blueLight}; border-radius: 3px; }
  .fade-in { animation: fadeIn .3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
`;

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px", boxShadow: "0 2px 8px rgba(74,111,165,.07)", ...style }}>
    {children}
  </div>
);

const StatBox = ({ label, value, prev, accent }) => {
  const p = pct(value, prev);
  return (
    <div style={{ background: accent ? C.blue : C.card, border: `1px solid ${accent ? C.blue : C.border}`, borderRadius: 12, padding: "16px 20px", flex: 1, minWidth: 130, boxShadow: "0 2px 8px rgba(74,111,165,.07)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: accent ? "rgba(255,255,255,.75)" : C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: accent ? "#fff" : C.text, fontFamily: "Nunito" }}>{typeof value === "number" && value > 999 ? fmt$(value) : value}</div>
      {prev !== undefined && <div style={{ marginTop: 4 }}><Arrow val={p} /></div>}
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", background: "#fff", transition: "border .2s" }}
      onFocus={e => e.target.style.borderColor = C.blue}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  </div>
);

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", background: "#fff", cursor: "pointer" }}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const base = { border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, transition: "all .2s", fontFamily: "Lato, sans-serif", ...style };
  const v = {
    primary: { background: C.blue, color: "#fff" },
    secondary: { background: C.bluePale, color: C.blue },
    danger: { background: "#fee2e2", color: "#dc2626" },
    success: { background: "#dcfce7", color: "#16a34a" },
  };
  return <button style={{ ...base, ...v[variant], opacity: disabled ? .6 : 1 }} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Badge = ({ children, color = C.blue }) => (
  <span style={{ background: color + "20", color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: .5 }}>{children}</span>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: C.muted, borderBottom: `2px solid ${C.bluePale}`, paddingBottom: 6, marginBottom: 12 }}>{children}</div>
);

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handle = () => {
    const ok = onLogin(email, password);
    if (!ok) setErr("Invalid email or password.");
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(150deg, ${C.blueDark} 0%, ${C.blue} 55%, ${C.blueLight} 100%)`, display: "flex", alignItems: "stretch" }}>

      {/* Left branding panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 48px", textAlign: "center" }}>
        <img src={LOGO} alt="Celebration Church" style={{ height: 140, marginBottom: 32, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))" }} className="fade-in" />
        <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 16, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          Celebration Church
        </h1>
        <div style={{ width: 60, height: 3, background: C.accent, borderRadius: 2, marginBottom: 20 }} />
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", fontStyle: "italic", lineHeight: 1.7, maxWidth: 340, fontFamily: "Lato, sans-serif", letterSpacing: 0.3 }}>
          "Building People, Building Dreams,<br />Building the Kingdom of God"
        </p>
        <div style={{ marginTop: 48, padding: "12px 24px", background: "rgba(255,255,255,0.1)", borderRadius: 30, border: "1px solid rgba(255,255,255,0.2)" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Statistics Portal</span>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ width: 420, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 44px", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
        <div className="fade-in" style={{ width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <img src={LOGO} alt="Celebration" style={{ height: 60, marginBottom: 12 }} />
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: 20, fontWeight: 900, color: C.blueDark, marginBottom: 4 }}>Welcome Back</h2>
            <p style={{ fontSize: 13, color: C.muted }}>Sign in to your account</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Email Address" value={email} onChange={setEmail} type="email" />
            <Input label="Password" value={password} onChange={setPassword} type="password" />
            {err && <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>{err}</div>}
            <Btn onClick={handle} style={{ marginTop: 8, padding: "13px", fontSize: 15, borderRadius: 10, background: C.blueDark }}>Sign In →</Btn>
          
          </div>
        </div>
      </div>

    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout }) {
  const links = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "entry", icon: "✏️", label: "Enter Stats" },
    ...(user.role === "admin" ? [
      { id: "consolidated", icon: "🌍", label: "All Branches" },
      { id: "admin", icon: "⚙️", label: "Admin Portal" },
    ] : []),
  ];
  return (
    <div style={{ width: 220, background: C.blueDark, minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
        <img src={LOGO} alt="Celebration" style={{ height: 50, filter: "brightness(0) invert(1)", opacity: .9 }} />
        <div style={{ fontSize: 10, color: C.accent, fontStyle: "italic", marginTop: 8, lineHeight: 1.5, letterSpacing: 0.2 }}>
          Building People,<br />Building Dreams,<br />Building the Kingdom of God
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {links.map(l => (
          <button key={l.id} onClick={() => setPage(l.id)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 20px",
            background: page === l.id ? "rgba(255,255,255,.12)" : "transparent",
            border: "none", color: page === l.id ? "#fff" : "rgba(255,255,255,.65)",
            fontWeight: page === l.id ? 700 : 400, fontSize: 14, cursor: "pointer",
            borderLeft: page === l.id ? `3px solid ${C.accent}` : "3px solid transparent",
            transition: "all .15s", textAlign: "left", fontFamily: "Lato, sans-serif"
          }}>
            <span>{l.icon}</span>{l.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 2 }}>{user.role === "admin" ? "Administrator" : "Data Capturer"}</div>
        <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginBottom: 10 }}>{user.name}</div>
        {user.branch && <div style={{ fontSize: 11, color: C.accent, marginBottom: 10 }}>{user.branch}</div>}
        <Btn variant="secondary" onClick={onLogout} style={{ width: "100%", fontSize: 12, background: "rgba(255,255,255,.1)", color: "#fff" }}>Sign Out</Btn>
      </div>
    </div>
  );
}

// ── STAT ENTRY ────────────────────────────────────────────────────────────────
function EntryPage({ user, stats, setStats }) {
  const today = new Date().toISOString().split("T")[0];
  const [branch, setBranch] = useState(user.branch || BRANCHES[0]);
  const [date, setDate] = useState(today);
  const [form, setForm] = useState({
    adults: "", vip: "", children: "",
    salvations: "", rededications: "",
    tithe: "", offering: "", firstFruit: "", compassion: "",
    specialLabel: "", specialAmt: "",
    otherLabel: "", otherAmt: "",
    highlights: "",
  });
  const [saved, setSaved] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const n = k => Number(form[k]) || 0;
  const totalAtt = n("adults") + n("vip") + n("children");
  const totalOff = n("tithe") + n("offering") + n("firstFruit") + n("compassion") + n("specialAmt") + n("otherAmt");

  const submit = () => {
    const entry = {
      id: `${branch}-${date}`,
      branch, date,
      attendance: { adults: n("adults"), vip: n("vip"), children: n("children") },
      alterCall: { salvations: n("salvations"), rededications: n("rededications") },
      offerings: {
        tithe: n("tithe"), offering: n("offering"), firstFruit: n("firstFruit"),
        compassion: n("compassion"),
        special: { label: form.specialLabel, amount: n("specialAmt") },
        other: { label: form.otherLabel, amount: n("otherAmt") },
      },
      highlights: form.highlights,
    };
    setStats(prev => {
      const filtered = prev.filter(s => s.id !== entry.id);
      return [entry, ...filtered];
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fieldRow = (children) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>{children}</div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: 780, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Enter Service Statistics</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Record attendance, altar call results and offerings.</p>

      <Card style={{ marginBottom: 20 }}>
        <SectionTitle>Service Details</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {user.role === "admin"
            ? <Select label="Branch" value={branch} onChange={setBranch} options={BRANCHES} />
            : <div><label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>Branch</label>
              <div style={{ padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.bluePale, fontWeight: 700, color: C.blue, marginTop: 4 }}>{branch}</div></div>
          }
          <Input label="Service Date" value={date} onChange={setDate} type="date" />
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Attendance</SectionTitle>
        {fieldRow([
          <Input key="a" label="Adults" value={form.adults} onChange={v => upd("adults", v)} type="number" />,
          <Input key="b" label="VIP" value={form.vip} onChange={v => upd("vip", v)} type="number" />,
          <Input key="c" label="Children" value={form.children} onChange={v => upd("children", v)} type="number" />,
        ])}
        <div style={{ marginTop: 12, padding: "10px 14px", background: C.bluePale, borderRadius: 8, fontSize: 14, fontWeight: 700, color: C.blue }}>
          Total Attendance: <span style={{ fontSize: 18 }}>{totalAtt}</span>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Altar Call</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Salvations" value={form.salvations} onChange={v => upd("salvations", v)} type="number" />
          <Input label="Re-dedications" value={form.rededications} onChange={v => upd("rededications", v)} type="number" />
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Offerings</SectionTitle>
        {fieldRow([
          <Input key="t" label="Tithe ($)" value={form.tithe} onChange={v => upd("tithe", v)} type="number" />,
          <Input key="o" label="Offering ($)" value={form.offering} onChange={v => upd("offering", v)} type="number" />,
          <Input key="f" label="First Fruit ($)" value={form.firstFruit} onChange={v => upd("firstFruit", v)} type="number" />,
        ])}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 12 }}>
          <Input label="Compassion ($)" value={form.compassion} onChange={v => upd("compassion", v)} type="number" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 12 }}>
          <Input label="Special Offering (label)" value={form.specialLabel} onChange={v => upd("specialLabel", v)} />
          <Input label="Amount ($)" value={form.specialAmt} onChange={v => upd("specialAmt", v)} type="number" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 12 }}>
          <Input label="Other (label)" value={form.otherLabel} onChange={v => upd("otherLabel", v)} />
          <Input label="Amount ($)" value={form.otherAmt} onChange={v => upd("otherAmt", v)} type="number" />
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: C.bluePale, borderRadius: 8, fontSize: 14, fontWeight: 700, color: C.blue }}>
          Total Offerings: <span style={{ fontSize: 18 }}>{fmt$(totalOff)}</span>
        </div>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <SectionTitle>Key Highlights</SectionTitle>
        <textarea value={form.highlights} onChange={e => upd("highlights", e.target.value)}
          placeholder="Notable moments, special guests, testimonies..."
          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, minHeight: 90, resize: "vertical", fontFamily: "Lato, sans-serif" }} />
      </Card>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Btn onClick={submit} style={{ padding: "12px 32px", fontSize: 15 }}>Save Statistics</Btn>
        {saved && <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>✓ Saved successfully!</span>}
      </div>
    </div>
  );
}

// ── DASHBOARD (branch) ────────────────────────────────────────────────────────
function DashboardPage({ user, stats }) {
  const branchStats = user.role === "admin"
    ? stats
    : stats.filter(s => s.branch === user.branch);

  const sorted = [...branchStats].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const prev = sorted[1];
  const lastYear = sorted.find(s => {
    if (!latest) return false;
    const d = new Date(s.date);
    const ld = new Date(latest.date);
    return Math.abs(d.getFullYear() - ld.getFullYear()) === 1 &&
      Math.abs(d.getMonth() - ld.getMonth()) <= 1;
  });

  const chartData = sorted.slice(0, 8).reverse().map(s => ({
    date: s.date.slice(5),
    Adults: s.attendance.adults,
    Children: s.attendance.children,
    VIP: s.attendance.vip,
    Tithe: s.offerings.tithe,
    Offering: s.offerings.offering,
    Total: totalOfferings(s),
    Salvations: s.alterCall.salvations,
  }));

  const pieData = latest ? [
    { name: "Adults", value: latest.attendance.adults },
    { name: "VIP", value: latest.attendance.vip },
    { name: "Children", value: latest.attendance.children },
  ] : [];
  const PIE_COLORS = [C.blue, C.accent, C.blueLight];

  if (!latest) return <Card><p style={{ color: C.muted }}>No data recorded yet for {user.branch || "any branch"}. Enter stats to see the dashboard.</p></Card>;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900 }}>{user.role === "admin" ? "My Branch" : user.branch} Dashboard</h2>
          <p style={{ color: C.muted, fontSize: 13 }}>Latest service: {latest.date}</p>
        </div>
        <Badge color={C.blue}>{user.branch || "All"}</Badge>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatBox label="Total Attendance" value={totalAttendance(latest)} prev={prev ? totalAttendance(prev) : undefined} accent />
        <StatBox label="Adults" value={latest.attendance.adults} prev={prev?.attendance.adults} />
        <StatBox label="Children" value={latest.attendance.children} prev={prev?.attendance.children} />
        <StatBox label="Salvations" value={latest.alterCall.salvations} prev={prev?.alterCall.salvations} />
        <StatBox label="Total Offerings" value={totalOfferings(latest)} prev={prev ? totalOfferings(prev) : undefined} />
      </div>

      {/* Comparisons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle>vs Previous Week</SectionTitle>
          {prev ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr>{["Metric", "This Week", "Last Week", "Change"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "4px 8px", color: C.muted, fontWeight: 700, fontSize: 11 }}>{h}</th>
              ))}</tr></thead>
              <tbody>
                {[
                  ["Total Attendance", totalAttendance(latest), totalAttendance(prev)],
                  ["Adults", latest.attendance.adults, prev.attendance.adults],
                  ["Salvations", latest.alterCall.salvations, prev.alterCall.salvations],
                  ["Offerings", fmt$(totalOfferings(latest)), fmt$(totalOfferings(prev))],
                ].map(([m, a, b]) => (
                  <tr key={m} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "7px 8px", fontWeight: 600 }}>{m}</td>
                    <td style={{ padding: "7px 8px", color: C.blue, fontWeight: 700 }}>{a}</td>
                    <td style={{ padding: "7px 8px", color: C.muted }}>{b}</td>
                    <td style={{ padding: "7px 8px" }}><Arrow val={pct(Number(String(a).replace(/[$,]/g, "")), Number(String(b).replace(/[$,]/g, "")))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color: C.muted, fontSize: 13 }}>No previous week data.</p>}
        </Card>

        <Card>
          <SectionTitle>vs Same Period Last Year</SectionTitle>
          {lastYear ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr>{["Metric", "This Week", "Last Year", "Change"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "4px 8px", color: C.muted, fontWeight: 700, fontSize: 11 }}>{h}</th>
              ))}</tr></thead>
              <tbody>
                {[
                  ["Total Attendance", totalAttendance(latest), totalAttendance(lastYear)],
                  ["Salvations", latest.alterCall.salvations, lastYear.alterCall.salvations],
                  ["Offerings", fmt$(totalOfferings(latest)), fmt$(totalOfferings(lastYear))],
                ].map(([m, a, b]) => (
                  <tr key={m} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "7px 8px", fontWeight: 600 }}>{m}</td>
                    <td style={{ padding: "7px 8px", color: C.blue, fontWeight: 700 }}>{a}</td>
                    <td style={{ padding: "7px 8px", color: C.muted }}>{b}</td>
                    <td style={{ padding: "7px 8px" }}><Arrow val={pct(Number(String(a).replace(/[$,]/g, "")), Number(String(b).replace(/[$,]/g, "")))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color: C.muted, fontSize: 13 }}>No last year data available.</p>}
        </Card>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Attendance Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.muted }} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Adults" fill={C.blue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Children" fill={C.blueLight} radius={[4, 4, 0, 0]} />
              <Bar dataKey="VIP" fill={C.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>Latest Service Breakdown</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % 3]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <SectionTitle>Offerings Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => fmt$(v)} />
            <Line type="monotone" dataKey="Total" stroke={C.blue} strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Tithe" stroke={C.accent} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── CONSOLIDATED (admin only) ─────────────────────────────────────────────────
function ConsolidatedPage({ stats }) {
  const [filterDate, setFilterDate] = useState("");
  const dates = [...new Set(stats.map(s => s.date))].sort().reverse();
  const selDate = filterDate || dates[0];
  const filtered = stats.filter(s => s.date === selDate);

  const totals = filtered.reduce((acc, s) => ({
    adults: acc.adults + s.attendance.adults,
    children: acc.children + s.attendance.children,
    vip: acc.vip + s.attendance.vip,
    salvations: acc.salvations + s.alterCall.salvations,
    rededications: acc.rededications + s.alterCall.rededications,
    offerings: acc.offerings + totalOfferings(s),
  }), { adults: 0, children: 0, vip: 0, salvations: 0, rededications: 0, offerings: 0 });

  const barData = BRANCHES.map(b => {
    const s = filtered.find(x => x.branch === b);
    return { branch: b.split(" ")[0], attendance: s ? totalAttendance(s) : 0, offerings: s ? totalOfferings(s) : 0 };
  });

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900 }}>Consolidated Dashboard</h2>
          <p style={{ color: C.muted, fontSize: 13 }}>All branches combined view</p>
        </div>
        <Select value={selDate} onChange={setFilterDate} options={dates.map(d => ({ value: d, label: d }))} />
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatBox label="Total Attendance" value={totals.adults + totals.children + totals.vip} accent />
        <StatBox label="Adults" value={totals.adults} />
        <StatBox label="Children" value={totals.children} />
        <StatBox label="Salvations" value={totals.salvations} />
        <StatBox label="Re-dedications" value={totals.rededications} />
        <StatBox label="Total Offerings" value={totals.offerings} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Attendance by Branch</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="branch" tick={{ fontSize: 11, fill: C.muted }} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="attendance" fill={C.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>Offerings by Branch</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="branch" tick={{ fontSize: 11, fill: C.muted }} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={v => fmt$(v)} />
              <Bar dataKey="offerings" fill={C.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <SectionTitle>Branch-by-Branch Summary — {selDate}</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bluePale }}>
              {["Branch", "Adults", "VIP", "Children", "Total Att.", "Salvations", "Re-ded.", "Total Offerings"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BRANCHES.map(b => {
              const s = filtered.find(x => x.branch === b);
              return (
                <tr key={b} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "9px 12px", fontWeight: 700 }}>{b}</td>
                  {s ? <>
                    <td style={{ padding: "9px 12px" }}>{s.attendance.adults}</td>
                    <td style={{ padding: "9px 12px" }}>{s.attendance.vip}</td>
                    <td style={{ padding: "9px 12px" }}>{s.attendance.children}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 700, color: C.blue }}>{totalAttendance(s)}</td>
                    <td style={{ padding: "9px 12px" }}>{s.alterCall.salvations}</td>
                    <td style={{ padding: "9px 12px" }}>{s.alterCall.rededications}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 700, color: C.blue }}>{fmt$(totalOfferings(s))}</td>
                  </> : <td colSpan={7} style={{ padding: "9px 12px", color: C.muted, fontStyle: "italic" }}>No data submitted</td>}
                </tr>
              );
            })}
            <tr style={{ background: C.bluePale, fontWeight: 800 }}>
              <td style={{ padding: "9px 12px" }}>TOTAL</td>
              <td style={{ padding: "9px 12px" }}>{totals.adults}</td>
              <td style={{ padding: "9px 12px" }}>{totals.vip}</td>
              <td style={{ padding: "9px 12px" }}>{totals.children}</td>
              <td style={{ padding: "9px 12px", color: C.blue }}>{totals.adults + totals.children + totals.vip}</td>
              <td style={{ padding: "9px 12px" }}>{totals.salvations}</td>
              <td style={{ padding: "9px 12px" }}>{totals.rededications}</td>
              <td style={{ padding: "9px 12px", color: C.blue }}>{fmt$(totals.offerings)}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── ADMIN PORTAL ──────────────────────────────────────────────────────────────
function AdminPage({ users, setUsers, branches, setBranches, stats, setStats }) {
  const [tab, setTab] = useState("users");
  const [emailStatus, setEmailStatus] = useState(null);
  const [uForm, setUForm] = useState({ name: "", email: "", role: "capturer", branch: "", password: "" });
  const [editUId, setEditUId] = useState(null);
  const upd = (k, v) => setUForm(f => ({ ...f, [k]: v }));

  const [saveMsg, setSaveMsg] = useState("");

  const saveUser = async () => {
    if (!uForm.name || !uForm.email || !uForm.password) {
      setSaveMsg("❌ Name, email and password are all required.");
      setTimeout(() => setSaveMsg(""), 4000);
      return;
    }
    const cleanUser = {
      name: uForm.name.trim(),
      email: uForm.email.trim().toLowerCase(),
      password: uForm.password.trim(),
      role: uForm.role,
      branch: uForm.role === "admin" ? null : uForm.branch,
    };
    const isNew = !editUId;
    if (editUId) {
      setUsers(us => us.map(u => u.id === editUId ? { ...u, ...cleanUser } : u));
      setEditUId(null);
      setSaveMsg(`✅ User "${cleanUser.name}" updated. They can now login with: ${cleanUser.email} / ${cleanUser.password}`);
    } else {
      setUsers(us => [...us, { ...cleanUser, id: Date.now() }]);
      setSaveMsg(`✅ User "${cleanUser.name}" created. Login: ${cleanUser.email} / ${cleanUser.password}`);
    }
    setTimeout(() => setSaveMsg(""), 8000);
    if (isNew) {
      setEmailStatus("sending");
      const result = await sendWelcomeEmail({ toName: uForm.name, toEmail: uForm.email, password: uForm.password, role: uForm.role, branch: uForm.branch, appUrl: window.location.origin });
      if (result.ok) setEmailStatus("sent");
      else if (result.reason === "EmailJS not configured") setEmailStatus("unconfigured");
      else setEmailStatus("error");
      setTimeout(() => setEmailStatus(null), 6000);
    }
    setUForm({ name: "", email: "", role: "capturer", branch: branches[0] || "", password: "" });
  };

  const editUser = (u) => { setUForm({ name: u.name, email: u.email, role: u.role, branch: u.branch || branches[0] || "", password: u.password }); setEditUId(u.id); };
  const deleteUser = (id) => setUsers(us => us.filter(u => u.id !== id));
  const [newBranch, setNewBranch] = useState("");
  const addBranch = () => { if (newBranch && !branches.includes(newBranch)) { setBranches(b => [...b, newBranch]); setNewBranch(""); } };

  const tabs = [{ id: "users", label: "👥 Users" }, { id: "branches", label: "🏛️ Branches" }, { id: "stats", label: "📋 Stats Log" }];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Admin Portal</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Manage users, branches, and data.</p>

      {saveMsg && (
        <div style={{ background: saveMsg.startsWith("✅") ? "#f0fdf4" : "#fef2f2", border: `1px solid ${saveMsg.startsWith("✅") ? "#22c55e" : "#ef4444"}`, color: saveMsg.startsWith("✅") ? "#15803d" : "#dc2626", borderRadius: 8, padding: "12px 16px", fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
          {saveMsg}
        </div>
      )}
      {emailStatus === "sending" && <div style={{ background: "#eff6ff", border: "1px solid #3b82f6", color: "#1d4ed8", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>📧 Sending welcome email...</div>}
      {emailStatus === "sent" && <div style={{ background: "#f0fdf4", border: "1px solid #22c55e", color: "#15803d", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>✅ Welcome email sent successfully!</div>}
      {emailStatus === "error" && <div style={{ background: "#fef2f2", border: "1px solid #ef4444", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>❌ Email failed. User was created — share login details manually.</div>}
      {emailStatus === "unconfigured" && <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", color: "#92400e", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>⚠️ User created. Email not sent — configure EmailJS below.</div>}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: `2px solid ${C.border}`, paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ border: "none", background: "transparent", padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Lato, sans-serif", color: tab === t.id ? C.blue : C.muted, borderBottom: tab === t.id ? `2px solid ${C.blue}` : "2px solid transparent", marginBottom: -2 }}>{t.label}</button>
        ))}
      </div>

      {tab === "users" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 16 }}>
            <Card>
              <SectionTitle>{editUId ? "Edit User" : "Add User"}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Input label="Full Name" value={uForm.name} onChange={v => upd("name", v)} />
                <Input label="Email" value={uForm.email} onChange={v => upd("email", v)} type="email" />
                <Input label="Password" value={uForm.password} onChange={v => upd("password", v)} />
                <Select label="Role" value={uForm.role} onChange={v => upd("role", v)} options={[{ value: "capturer", label: "Data Capturer" }, { value: "admin", label: "Administrator" }]} />
                {uForm.role === "capturer" && <Select label="Branch" value={uForm.branch} onChange={v => upd("branch", v)} options={branches} />}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <Btn onClick={saveUser}>{editUId ? "Update" : "Add User"}</Btn>
                  {editUId && <Btn variant="secondary" onClick={() => { setEditUId(null); setUForm({ name: "", email: "", role: "capturer", branch: branches[0] || "", password: "" }); }}>Cancel</Btn>}
                </div>
                {!editUId && <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#92400e", marginTop: 4 }}>💡 <strong>Email setup:</strong> Configure EmailJS below to auto-send login instructions.</div>}
              </div>
            </Card>
            <Card>
              <SectionTitle>All Users ({users.length})</SectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: C.bluePale }}>{["Name", "Email", "Role", "Branch", ""].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "8px 10px", fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: "8px 10px", color: C.muted, fontSize: 12 }}>{u.email}</td>
                      <td style={{ padding: "8px 10px" }}><Badge color={u.role === "admin" ? C.accent : C.blue}>{u.role}</Badge></td>
                      <td style={{ padding: "8px 10px", fontSize: 12 }}>{u.branch || "—"}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn variant="secondary" onClick={() => editUser(u)} style={{ padding: "4px 10px", fontSize: 11 }}>Edit</Btn>
                          <Btn variant="danger" onClick={() => deleteUser(u.id)} style={{ padding: "4px 10px", fontSize: 11 }}>Del</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
          <Card style={{ borderLeft: `4px solid ${C.accent}` }}>
            <SectionTitle>📧 Email Notifications Setup (Free)</SectionTitle>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Follow these steps once to enable automatic welcome emails when you add users:</p>
            <ol style={{ fontSize: 13, color: "#374151", lineHeight: 2, paddingLeft: 20 }}>
              <li>Go to <strong>emailjs.com</strong> → Sign up free</li>
              <li>Click <strong>Email Services</strong> → Add your Gmail or Outlook</li>
              <li>Click <strong>Email Templates</strong> → Create New Template → use variables: <code style={{ background: C.bluePale, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{"{{to_name}} {{login_email}} {{login_password}} {{role}} {{branch}} {{app_url}}"}</code></li>
              <li>Go to <strong>Account</strong> → copy your <strong>Public Key</strong></li>
              <li>In GitHub open <strong>src/App.js</strong>, find and replace these 3 lines:
                <pre style={{ background: C.bluePale, padding: 10, borderRadius: 8, fontSize: 12, marginTop: 6, overflowX: "auto" }}>{`const EMAILJS_SERVICE  = "YOUR_SERVICE_ID";\nconst EMAILJS_TEMPLATE = "YOUR_TEMPLATE_ID";\nconst EMAILJS_KEY      = "YOUR_PUBLIC_KEY";`}</pre>
              </li>
              <li>Commit → Netlify redeploys in ~2 minutes</li>
            </ol>
          </Card>
        </div>
      )}

      {tab === "branches" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
          <Card>
            <SectionTitle>Add Branch</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Input label="Branch Name" value={newBranch} onChange={setNewBranch} />
              <Btn onClick={addBranch}>Add Branch</Btn>
            </div>
          </Card>
          <Card>
            <SectionTitle>Branches ({branches.length})</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {branches.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: C.bluePale, borderRadius: 8 }}>
                  <span style={{ fontWeight: 600 }}>🏛️ {b}</span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Badge color={C.blue}>{stats.filter(s => s.branch === b).length} records</Badge>
                    <Btn variant="danger" onClick={() => setBranches(bs => bs.filter(x => x !== b))} style={{ padding: "4px 10px", fontSize: 11 }}>Remove</Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "stats" && (
        <Card>
          <SectionTitle>Statistics Log ({stats.length} records)</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
              <thead><tr style={{ background: C.bluePale }}>
                {["Date", "Branch", "Adults", "VIP", "Children", "Total Att.", "Salvations", "Re-ded.", "Total Offerings", ""].map(h => (
                  <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontSize: 10, fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[...stats].sort((a, b) => b.date.localeCompare(a.date)).map(s => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "7px 10px" }}>{s.date}</td>
                    <td style={{ padding: "7px 10px", fontWeight: 600 }}>{s.branch}</td>
                    <td style={{ padding: "7px 10px" }}>{s.attendance.adults}</td>
                    <td style={{ padding: "7px 10px" }}>{s.attendance.vip}</td>
                    <td style={{ padding: "7px 10px" }}>{s.attendance.children}</td>
                    <td style={{ padding: "7px 10px", fontWeight: 700, color: C.blue }}>{totalAttendance(s)}</td>
                    <td style={{ padding: "7px 10px" }}>{s.alterCall.salvations}</td>
                    <td style={{ padding: "7px 10px" }}>{s.alterCall.rededications}</td>
                    <td style={{ padding: "7px 10px", fontWeight: 700, color: C.blue }}>{fmt$(totalOfferings(s))}</td>
                    <td style={{ padding: "7px 10px" }}>
                      <Btn variant="danger" onClick={() => setStats(ss => ss.filter(x => x.id !== s.id))} style={{ padding: "3px 8px", fontSize: 10 }}>Delete</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
// ── LOCALSTORAGE HELPERS ──────────────────────────────────────────────────────
const LS_USERS = "cc_users";
const LS_STATS = "cc_stats";
const LS_BRANCHES = "cc_branches";

function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── EMAILJS HELPER ────────────────────────────────────────────────────────────
// To enable emails: sign up free at emailjs.com, create a service + template,
// then replace the three IDs below with your own.
const EMAILJS_SERVICE  = "service_61m7n0f";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE = "template_2df0v4v";  // e.g. "template_xyz789"
const EMAILJS_KEY      = "njhN8mN77cVNwY4dJ";   // e.g. "abcDEFghiJKL"

async function sendWelcomeEmail({ toName, toEmail, password, role, branch, appUrl }) {
  if (EMAILJS_SERVICE === "YOUR_SERVICE_ID") return { ok: false, reason: "EmailJS not configured" };
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE,
        template_id: EMAILJS_TEMPLATE,
        user_id: EMAILJS_KEY,
        template_params: {
          to_name: toName,
          to_email: toEmail,
          login_email: toEmail,
          login_password: password,
          role: role === "admin" ? "Administrator" : "Data Capturer",
          branch: branch || "All Branches",
          app_url: appUrl || window.location.origin,
        },
      }),
    });
    return res.ok ? { ok: true } : { ok: false, reason: "Send failed" };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  // Persist stats, users, branches in localStorage
  const [stats, setStatsRaw] = useState(() => lsGet(LS_STATS, SEED_STATS));
  const [users, setUsersRaw] = useState(() => lsGet(LS_USERS, USERS));
  const [branches, setBranchesRaw] = useState(() => lsGet(LS_BRANCHES, BRANCHES));

  const setStats = v => {
    setStatsRaw(prev => { const next = typeof v === "function" ? v(prev) : v; lsSet(LS_STATS, next); return next; });
  };
  const setUsers = v => {
    setUsersRaw(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(LS_USERS, JSON.stringify(next)); } catch(e) { console.error("Save users failed", e); }
      console.log("Users saved to localStorage:", next);
      return next;
    });
  };
  const setBranches = v => {
    setBranchesRaw(prev => { const next = typeof v === "function" ? v(prev) : v; lsSet(LS_BRANCHES, next); return next; });
  };

  // Login reads directly from localStorage — always up to date
  const handleLogin = (email, password) => {
    let latestUsers = USERS;
    try {
      const stored = localStorage.getItem(LS_USERS);
      if (stored) latestUsers = JSON.parse(stored);
    } catch(e) {}
    console.log("Login attempt:", email, "| Users in storage:", latestUsers.map(u => u.email));
    const found = latestUsers.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password.trim() === password.trim());
    if (found) { setUser(found); setPage("dashboard"); return true; }
    return false;
  };

  if (!user) return (
    <>
      <style>{css}</style>
      <LoginScreen onLogin={handleLogin} />
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar page={page} setPage={setPage} user={user} onLogout={() => setUser(null)} />
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxHeight: "100vh" }}>
          {page === "dashboard" && <DashboardPage user={user} stats={stats} />}
          {page === "entry" && <EntryPage user={user} stats={stats} setStats={setStats} />}
          {page === "consolidated" && user.role === "admin" && <ConsolidatedPage stats={stats} />}
          {page === "admin" && user.role === "admin" && (
            <AdminPage users={users} setUsers={setUsers} branches={branches} setBranches={setBranches} stats={stats} setStats={setStats} />
          )}
        </main>
      </div>
    </>
  );
}
