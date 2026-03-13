import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── SUPABASE CONFIG ───────────────────────────────────────────────────────────
const SUPA_URL = "/supabase";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZXRkYXp1dGt4dmFpeGJobm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjEyNzAsImV4cCI6MjA4ODg5NzI3MH0.QbnIMpr8Gwur7TmU8J3Re1rdEpzufnwcBYeGC7CVn1Y";
const H = { "Content-Type": "application/json", "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}` };

const db = {
  async get(table, params = "") {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, { headers: { ...H, "Prefer": "return=representation" } });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async insert(table, body) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, { method: "POST", headers: { ...H, "Prefer": "return=representation" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async update(table, match, body) {
    const params = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join("&");
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, { method: "PATCH", headers: { ...H, "Prefer": "return=representation" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async upsert(table, body) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, { method: "POST", headers: { ...H, "Prefer": "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async delete(table, match) {
    const params = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join("&");
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, { method: "DELETE", headers: H });
    if (!r.ok) throw new Error(await r.text());
    return true;
  },
};

// ── LOGO ──────────────────────────────────────────────────────────────────────
const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAfDklEQVR4nO3dXXbiVrow4Dff6nv7G0HRIwg9gpARxLngcFlkAgd6BHFG0OZMINQlh4umRhBqBI1H0PYI2h5BnQttxxSWhCRkg/DzrOWVikB7byOs/Wr/RgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFDPd8cuAM18/fr12EXgDI0my15E9CKiHxEPEXG3mA3XRysQJ++771QjXeXKdZQAgDaNJstxREwj4vuclx8j4mYxG16/YZHoCAFAd7lyHSUAoA2jyXIQEfOI+FDh7Z8Ws+H4NctD9wgAuuv/HbsAwHGkp/4/olrlHxHxMZ0DnAEBALxDqSL/vcGp03ZLAhyLAADemdFkeRXNKv+I/DECQAcJAOAdGU2Wl5H1+QPvnAAA3pdpRFwcuxDA8QkA4H0ZH3j+bRuFAI5PAADvxGiy7Ef1Ef9F1oeXBDgFAgB4P/otpHHTQhrACRAAwPvRO/D8z4vZ8K6FcgAn4C/HLgDQGT+NJsuvkS0NvImIu/SzjmzPgLsjlQtowBqOHWUpYOpK8///+YpZPAUG64hY20TofbAUcHe5ch0lAKCqNPhvnH7ecgrgY2TBwGoxG87z3rC1++AgHdpExIPgoTsEAN3lynWUAIB99uzw99YeI2IVEdeL2fAuBSU3EfFDyTmfoyR44DQIALrLlesoAQBFUsV/HYdP+XstnyN74q/aGnEfEdPFbLh6rQLRnACgu1y5jhIAsCv18d/E6Vb8RT5HtjzxQ/r/y4i4Sj/bQYLtiE+QAKC7XLmOEgDwJPWjz6O8Ob0Nt5GN+t9EVllvtl7bLGbDh90TUlP/5dahQUT8uvX/hZV62rdguvP+24gY5OXFcQgAusuV6ygBABERo8lyGllz/2sM7vsc2SC+TVuD8kaT5SAi/tg69OO+tFMQsY7n31FLwAkRAHSXK9dRAoD3LT0dr6L9p/5PkQ28W7Wc7p/SWgJPfq6SVwoC/lX3PF6fAKC7rAQIHZMqw020V/nfR8RvEfH/F7Ph+A0q1k9b/55WOWExG252zhu3Vxx4n6wECB2SBvrNo50m/8fIpuXdtJBWHdfxPMDvh9FkOa/YpL+KiI/p3z+9RsHgPdECAB2Rpvf9M9qp/GcR0TtC5R9pyeCrrUMfR5PlKnVrlBm8UpHgXdJ501HGALwvqfL/vYWkHiPi6hRW2ksDAlfxHNA8RjaNcb67r0Aa7PiPrUO3i9mw/8pFpAJjALrLlesoAcD70WLlf3JT6EqmMN5HNuUwItvGeLfVwyDAEyEA6C5XrqMEAO9DzrS5pk6u8t+Wfs9p7O/bf4xsVcD5KxeJigQA3eXKdZQA4PzlzH9v6qQr/21pHMBVZE/9/a2X7uJ5Y6GHNy0UpQQA3eXKdZQA4LylinAdh2/k05nKn24SAHSXWQBwmm7i8Mr/acDfw8GlAc6OAABOTJrr/3Hf+yoY746mB3ii7aajdAGcp9T0fxeH9/t/XsyGV4eWB/bRBdBdWgDgtFxHOwv9TFtIAzhjQreO0gJwftKc+H+3kJTd8ngzWgC6SwsAnI7rE0sHOGNCt47SAnBeWnz61/fPm9IC0F1aAOA0XLeUzryldIAzJ3TrKC0A5yON/P9PG2ktZkN/07wpLQDdpQUAjm/cUjpfWkoHeAcEAHB845bS2bSUDvAOCADgiNLgv0OX/H3y0FI6wDsgAIDjumoxrYcW0wLOnAAAjmvQYlqXLaYFnDkBABzX4NgFAN4nAQAcSer/b2Pd/ye9FtMCzpwAAI6n33J6g5bTA86YAACOp99yeh9SqwLAXgIAOJ7eK6R5/QppAmdIAADH03uFND+OJsv+K6QLnBkBAJyfedpfAKCQAADOz/cRsRYEAGUEAHCevo+IzSl3B4wmy8vRZHk9mixvjl0WeI/+cuwCAK/mQ0T8azRZ/hYRN4vZ8OHI5YmIP7c/nqafi4j4dMTiwLulBQDO36+RtQaMj1mI0WTZG02W84j4TyrTRUTcRhYIAG/su2MXgGa+fv167CJwoNFkuY6IH9442/uIuImI+Vu1CKRuiGlEfNx56TYiBqfSMkEz332nGukqV66jBADdd6QAYNvniFhFxKrtSjgtSHQVEePI3+5Y5X8mBADd5cp1lACg+9Lgt8mxy5HcRsQ6IjYRsVnMhps6J6en/H5kyxEPIht/UJaXyv9MCAC6yyBAOJ6HYxdgy/ex9aQ+miwjIh4jCwiePP27v3WsF+WV/a7PETFW+cPxCQDgeNaRDYY7VRfxbRfFod0Vvy1mw+sD0wBaIgCA49kcuwBv5D6yp/71sQsCPDMNEI4kNYPfH7scr2wWEX2VP5weLQBwXOt4OT3uHHyJ7Kn/7tgFAfIJAOC4VnFeAcCnyFYd3By7IEA58zc6yjTA8zGaLB8iG3DXxG1kswmOuZ7Amy8uxOkwDbC7tADA8a3igFaAxWw4SAvvTCNbfKfOtLym7iMr99zTPnST0K2jtACcj9FkOYiIPw5I4q/bfe1bq/AN0k/T1oVtj5GNV1hHxFqlzxMtAN3lynWUAOC8jCbLu2j+5P73xWx4U5J2P7IFe57+20sv9XbyfOpOiMimKD7E88qAdw3LxpkTAHSXK9dRAoDzknbq+73h6feL2bDXXmmgOgFAd1kHAE7AYjacR/M1AT4ce6tfoHsEAHA6rg84d9xSGYB3QttNR+kCOE+jyXIT+dvnVvHzYjZctVca2E8XQHdpAYDTMj3g3JvRZHnZUjmAMycAgBOS1syfNTz9QxwWQADviAAATs91NB8Q+Gua9gdQSgAAJyYtpzs+IImVrgBgHwEAnKDUFfD3hqd/iIh5a4UBzpIAAE5UWt3vU8PTfxpNlvP2SgOcGwEAnLZpZEv0NvFxNFlO2ysKcE5M4Owo6wC8H6k/fx3N1wf4Ja00CK2zDkB3aQGAE5cGBQ6ieUvA76PJ8rqt8gDnQejWUVoA3p8WWgI+LWbDcVvlgQgtAF3mynWUAOB9SkHAPCJ+apjEl4i4Sq0KcDABQHe5ch0lAHjfRpPlTURMGp7+GFkQsG6tQLxbAoDucuU6SgDAaLK8iqw14KJhErOIuNYawCEEAN3lynWUAICIiNFk2YssCPihYRL3ETHWGkBTAoDucuU6SgDAttFkOY6Im2jeGvA5IqaL2fCupSLxTggAusuV6ygBALvSAMFpRPx6QDKfIusWuGuhSLwDAoDucuU6SgBAkdQtcB0RHw9I5lNE3Cxmw00LReKMCQC6y5XrKAEA+2y1CIwj2yCoidvIxhistAqQRwDQXa5cRwkAqCPNGHj6aTpO4DayhYg2EXFn4CARAoAuc+U6SgBAU6PJsh9ZIDCIiH40DAgWs6H7BwKADnPlOkoAQFvSmIFeZMHAZfrp57z1IbKn/4iIzWI2XL1qwegEAUB3uXIdJQAAToEAoLvsBggA75AAAADeIQEAALxDfzl2AaBNae77VfpZL2bDmyMWp9DWSPxeZEvwPhyxOOxI36NxZDMl7iJbB2F9tALBKxAAvGOpErqM7Ca3axNp1PepV05blf4gvp3n/lNk6+OfhPR5jyMr4/bCPHeRrdzHCUjXaR3fTo+cjCbLXxaz4fwYZYLXIAB4R9J0r6vIKsqfapx3H9kNcXUqU79SpX8T2e/SdJW7V5cW4JnGAfPteXM3kX+tfh9NlmsrInIuBADvwGiyHERWCVWu9Hd8iGxd+Y8pGJieQCAwjcPWun8r/zx2AaguBZZlWytfxQm1KsEhDAI8Y6PJsjeaLNcR8UeUV/5f0s9thWQ/RMQ/R5PlzcEFPMxNZBvWnLpZRDweuxBU1tvz+uUblAHehBUcOmrfQkCjyXIaWb9yXlPmfWQVaO4GL1vrxu97wv7rsZtDR5PlOIqbbE9iudoK2/T+tpgNr9+qPJQbTZYPUdxd86PBgN+yEFB36QI4Q6PJch75lXel5vv0+io95c8j4vuCt17FkZtDF7PhPLVy/PuY5SiTBlFepzEYXei26JQ0aO8m/e9DRIwPHLg6jYjfc45/UflzTnQBnJHRZHk5miw3kV/JfI6Ifp2++7QX/CCKuwYuaxXwlaRWiCrdF8c2P3YBztQ8sn77HyLr6uofklga6f9zPH+nHiPit8gCXjgbWgDOyyryn9Y/LWbDcZMEF7PhQxpEuM5Ju98kzVfycOwC8PZS90pRC1VjT61gbacLp0QLwJlIzf55o5c/N638n6Tm1Lw0Lg9JF1rQP3YBoKsEAGcgDdor6vMft5FH6g7owqh73perYxcAukoA0HGpCXRe8PKhg6F2Xce3U9rWLaYNtWwt1ws0YAxA900jf8pS6yOWF7PhXZpe+DRCunH6aeR2L75twl1HxN2xpxbuSmMgevE8R/whsqWSX32Z5FTJ9ePb5ZrX0cLnlGYlDCLismjPhK339CL7vXOnjpbk0Y+sq+jpv0/WEfGQWpZqS5/LOt5gdcV0/QcRcXPo9U6fZy++vZ536afV71OVcqfy9OP57/AhlWPdVjk4XSZwdtTXr1+fboJ3kX8T/PkEVuv7RqoMpvHtev157iNr1ah8w01TAV+MgWi6DkCN1RNvIyvnvGKaf+S89GIdgIr5V857J+2reLnOw9+3g4CtpZZ3u5YeI5tKmpvn1lP5VZSvqLed3ioirqsEFqnCGkdx4BtR8N3fqnwj9lS2Bfs2NBpMm/Kdxss9IPLcRvbdnzcJBqqWO62fcV1SnsrXxToA3eXKdVQKAKYR8Y+cl+8Xs2HvbUtULN0Ab6L+UsSllc1OHutoIQDYmlNepfLadh9Zl8u6JO1B7AkAtrp06nxWtynvTUG+l/G8s90g8ivO7TL0o/zp+jEiersV1GiyvI7yinmf2WI2nBa9OJosV1Htc3mMrIUmImt1KJol8Lenz2xnn4xBFLeqDSrkHynNy8gPoqp4jCy4u66Qx1U8lzuvQv+z3Ok7OC94X1E5Sv8GBQDdZQxAt00Ljq/esAyl0tPmJvJv3F8iG1j4KfLn8V9EtgHL/JWK940UUP0rXlb+j5GVdRbZegr3Oad/iIg/0pNV0/z7kbXo1A2Uvo+IdTo/zzyyQPGn2FM5V6j8I7022DnvOrKVDsvOu43nZafzTEaT5SZVanmqfi4X8bwuQNkUwe181lHxM6oiVbR3kV/5b38Oed+lSGX4dTRZrks+j4js2v6e8imt1NN3849978spx++HfK85XcYAdFR6Yin6Q16/XUmKpZvG7opqj5E9Fb1o3i9pKfg4mizj0OmMZQpWTyx8+kk3+Jt4WcH8nsr64pw9+V9FdjNvWvlcRBYEDHJaAlZRofJMn/+6Yhn68W2gOS1572+xc71TpXYdEZOd934f2ec6rlCGQ222/n0d+av/1VbwvY/IPof5bpP6nhayH+L5uj7kvJ53rE6Zqvp9NFlumo7Z4DRpAeiuq5LX1m9UhkIllf9gMRte593MFrPh3WI2vIr86YYfUyXZurTk8W7lfxtZM/c875zU1D+IrEVg1026qVd1Fd9W/k8rz/11MRt+9/QT2ep0RU/Pkc5f7T4xpt/hrynNMttl2Gfz9I/UapB33mNkzewvrvdiNnxIzf15ZfqYAqxds3h+cv4SxZssPe68b7fV4T4iftkuU/qMfoziJ/JKSr73T5/D3e45W9/7XwqSfWrhucw5dxxZucum6Pbi5ZLdX1J+P6afn/ekETlp0HE6bzrqv/77f+dRMPf/2P3/Bc3IT5X/pmIa63jZFF/4uzUdA5CCit0te29TWR8qlPMysspwtzXmRX9xyRiA3byvygZelYz9eFK4uVDZuJH49nf4Elnrx2Zr8ObHrff2nz6fgt+r8vUu2Hznc6oUy867ivztlg8aAFsy1qB0DEAK+jbx8nepvIHQnif1fWMkrqN4w6knj5F9v3LLU6EL6G+719QYgO7SAtBdvYLjd29YhiLzeHkDua7ZfHidc+xDm32RJWsoVF4/Ib3vJuelH0r65Is8VZp3e/K8ieKnxYiIaVG/cdF0v/i28v+8mA3/rLwXs+EmPWn+NbKnxX6Fz2da43qvc479tKfvO6K4+bvoeFU3Dc+bx8vv/azOlLrUEpHXqhSRjZHol5x+syf5p+9XYXm29v8oUvYaHSMA6K7+sQuQJ1XQu/3i9yUVT66Sm9S0dqGK3cTLG/anBv2c64Lj45rp1Ak85lFcUVxEeRdRWTfCYxSUOzVVryuU8XPNMRCbguP9Gmm06aHuCak1Im/myHWD/MdR3L1RmF6F61I4U2QnnU0Udwf0951PdwgAuquoiW7zloXIcZ1z7KZhWnn9sa1s/FKyNe9Ng+TuCo4PaqRx26DZelry2lXNtJ40Wezmbuvfj1E/SBsUHL+smU4rGg50u8459qnJXP6SVqWIrGWkVzfNyILwVY33F723Sd6cKAHA+Xk4VsbpKShvZsKqQVqXBWlFwQCxusY5x+4b3vwHBcfrBCvzupmmroKiJ7W6UwkPLcfPkQ3o29uFsS1VZkVrLvTrluUYUrN83rVeH5DsvOS1q5bTy7NukAcdIwA4P70j5n2Vc+yx7pK1WwuovKZxzrG7uomkCuz6sKJERPO1GwrPazAG4bbp8sKL2XCVRrlvqp6TrvOqSX5Jv+B45TK05Krg+KZpguk65K2NEdGsH35dM/+HBnnQMdYBOD+9I+Z9lXcwTbN7qJjGILIbe9l0tKpp5UoVY17rQi+NpK7iMrJy1l0xMM/9IRXvaLIsevmyZnKbJmVoIgVOqzisS+cy7+ARKq9B3sEW5syvIv/zyc1vj80hBeE8CQC6a3fa1lGVzAW/iJeLvRzisYUba7/g+IfYP42qjqJBervuDsznS+QHIr2a6Rxajr3SU/80qi0ZvHnd0rSmjSAwz6bgeO3FojzRk0cXQHfdFRzvv2EZtvXeKJ9pC2n0Wkhjn8eo3jWwOTCvh4LjvZrprA8qRYnRZNlPqy3exf4lg588vFZ5OmJT9ELN7p2DFjfifGkB6K5N5D95XIwmy17TJuUD9AuOP0Y2AOnhwPQfouZWtCUGBceflik+1F1kZX2o+P6q7yuyieaD/l7N1gY70yhurZql/7bZSvRmWhqQmmuRbb9d9PJljaTuDi4MZ0kA0F2bktf6cTp/9Ht3NDshhSukddS65vsf2sg0rQUxjvKm8U+RtpqtMe4CaJEAoLtWUbxk6FWczo6AvWMXoIZBvOPpT4eOrUjTQG+i+Gn/PrLWoCZrDXTOK7fEPbxSurwjAoCOWsyGD6PJ8jbyRwlfvXFxyvSOXYB3bPMWmVTY9/4+sqf9ectZ91tOr7bFbLguaabvxyu1xNmVjzYYBNhtNwXHL46wf/ddwfH+G5ahqk3B8cEblqHNfPPOv3/Dp+xVFFf+s8j2DpiXnD9omO9l3sHX7Jevqf9K6RrURyu0AHTbKvLXs4/I+mDnr5FpGs39MbJBc71U0WwK3n4xmiz7J/bEcldw/LWmc+1z+Qrnrw9Ms5LUf1/0uf3yCk/9p6hoGuZVHLBIVMmSv5umacI2LQAdtmfN8B9eoxUg9fM+Pe1dRHrKSRV80QYmrZfjQOuiF47QchIR8X2Fne9ypfPyuoFWB5SnTt7TgpdnNSr/fgvFOaZNwfHvG67b/6RfcHx1QJrwJwFAx6UR9kVNgjdNK5Y8FZboXRccH7dZjkOlYKXoM7t+u5J8Y9DieY8NNhZq4iqK5/NfV0kgVZC1F7bZo99yevvMS14bH5DuoOD46oA0D9U7Yt60TABwHsYFxy+i3ZvFdZSvPjgvKUfRa5WMJsvegU9Tu+YFxz+MJsvpIQmnRW8ua542bpjdVc6xm4Zp1dUrOP6lxviDqwPyL8qjf0CatfdQ2BNQTg8Ifsc5xxrtMNiik1l9lMMJAM5Amrv+W8HLP6Q++4OkpvHSxVrSU2fRjfCnps3rqZ/53xGxqXtzLnn/vOS06wYb6cRosrxMn/W/ImJdM43a27wWbGnceDGjlgOsqqYHnLspOH51QJoRzcZkXBccv4gGv2P6W8lrGSnKp8xlg/xrn0P3CADOROoKKNoa9uNoslwd0M88juI1BzY7/z8tSer3OkFAeupfx/P6/BdRfHMvGoh2mXcwzc8uCpouomYFnt67jucK+fuo31w6r/n+m5xj1xWeEIs+q17N/Iv0q7wpBXaHPFE+FBy/KGvFGU2W49Fk+VDyXewVHO8XpZnGOxTt3vdrnZkJJV1tv5WtK1CSR5MNl/ol+fQapMcJEgCckcVsOI7y/eE3dadIpRtpUeV/u1vZpFaAojJEZEHAquwmkir+63i53HHu0+2e3+mq6IUUNBXdtC8i4l+jyfKmQlnnkT31b99obxv0w1durUmV1+7yv58Xs+HNnvP6JS9fVcl7y6bgeGkFnMoxjv0bL+0rz7rktX/sliFdq1Vk3+eLKG4pGRQcv9jz+Y1LXltVCShT5b+Ol0//XyqsqDkoSbfwtbpp7XmNDvnu2AWgma9fvxa+lirPspvrl4iYl43STqP9p1E+Ne7veRXO1k1s35PHbXrfQ/r/y8huLkXn/bi7VG+FvB4jYlA0DXHryX3fQLQv8W2F04vsKSkv38fI5r7f7eQ1iIg/9uQTkQVQ06In+YLrexvZ75l7zta56yi+pqWfVUF6d1H8FP/i+5GCqZv4NngpmkYXka0jcFcU2OzJPyL7nTaRfbd2r9VsMRtOd9LrRxbMFfmymA0HRS/uaS17jKyF5qbg3H5krUC75dx7bdPfwV0Uf49vF7Nhv+j8mmndR/b9foiI+O471UhXuXIdVRYARPxZ2cxjfxPrl8j+2O/S/w8iq9j2VYilN5QaQUAVjxEx3n2iLrlhVjp/J511tDMa/TbltcnJZxDVAoCI502UVlvHBpE9Ze5e0yoVRC+lt2+tg9LPKifdq4j45570Nunfl1FQuUXEf/Zk9aKyrph/kRefWWoxuI5qweC4qDl+TxAQkVWgq3gOfgeR/c3lbehU5dpeRXZt9/7NRrbfxV1JWoNUtn1p3Uf2GawFAN3lynXUvgDgSXpanEa7U61Kn1B38r+Jw3Z6y73Zpgrt3zXT+q2oGTUFLKs4bDGgfU/ug/g2APgtskrg+oB8P0f2+eTmmfLtRVYJ1/kO5LbuFKQ/jvIKr8ifZd9aXKpI2bXbd+6uvMr/Jup9T3NbebbS60e14LRMbtCzk89V1AuACsvdMJj6+X//579WNc/hRBgDcOYWs+H1Yja8jIhfIrvhNvUYWQX3t8VsWFrh7OQ/jYgfG+T9JSJ+XsyGg4Kb7EN6T1WPUdJnvJgNH1LT7s9RPC6gyOfIuif2fS7br92na7NO+f5YM98vKc+rCtfiIeqtHncfNVYSTF1JP0b1JWrvI1slcLvs0yheSOpTWf93GvtSNKBz22NkgUQ/5zNbl+SfZxMlG/IsZsNNaiH7Jeov3fv0dzat8N67mulvorjcddO6j9PZdZQGtAB0VNUWgF3pSXcQWZNjP7Jm2ct4flLZbrK9S//etLFN7uh5f/h+PPehX2zl+RDZjXhVdRe1GoObNnXmT6cnuEH6uYznJ/Snm95dPJe1TrrryH7v3L72lO/VVr5P1+U2vv18XpxbIe9BxbfW+qx28riKb79fF/H8mW0iYl3SFXMZ2fiAQWTdHHvHquyc34sskNjO+zblvYo91yrl36+SV92/h5zv01P5nr77d5Fd23XdHQTbLHedtCJ9T3QBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8H78H8cG90XPoPG9AAAAAElFTkSuQmCC";

// ── EMAILJS ───────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE  = "service_61m7n0f";
const EMAILJS_TEMPLATE = "template_2df0v4v";
const EMAILJS_KEY      = "njhN8mN77cVNwY4dJ";

async function sendWelcomeEmail({ toName, toEmail, password, role, branch, appUrl }) {
  if (EMAILJS_SERVICE === "YOUR_SERVICE_ID") return { ok: false, reason: "not configured" };
  try {
    // Route via /emailjs proxy to avoid CSP blocking api.emailjs.com
    const res = await fetch("/emailjs/api/v1.0/email/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE, template_id: EMAILJS_TEMPLATE, user_id: EMAILJS_KEY,
        template_params: { to_name: toName, to_email: toEmail, login_email: toEmail, login_password: password, role: role === "admin" ? "Administrator" : "Data Capturer", branch: branch || "All Branches", app_url: appUrl || window.location.origin },
      }),
    });
    const text = await res.text();
    console.log("EmailJS response:", res.status, text);
    return res.ok ? { ok: true } : { ok: false, reason: text };
  } catch (e) {
    console.error("EmailJS error:", e.message);
    return { ok: false, reason: e.message };
  }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const totalAttendance = s => s.attendance.adults + s.attendance.vip + s.attendance.children;
const totalOfferings  = s =>
  (s.offerings.tithe || 0) + (s.offerings.offering || 0) + (s.offerings.firstFruit || 0) +
  (s.offerings.compassion || 0) + (s.offerings.special?.amount || 0) + (s.offerings.other?.amount || 0);

const fmt$ = n => `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct  = (a, b) => b === 0 ? null : (((a - b) / b) * 100).toFixed(1);

const Arrow = ({ val }) => val === null ? null : (
  <span style={{ color: val >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 12 }}>
    {val >= 0 ? "▲" : "▼"} {Math.abs(val)}%
  </span>
);

// ── THEME ─────────────────────────────────────────────────────────────────────
const C = { blue: "#4A6FA5", blueDark: "#2d4a73", blueLight: "#6B8DBB", bluePale: "#E8EFF8", accent: "#F0B429", bg: "#F5F7FA", card: "#FFFFFF", border: "#DDE3ED", text: "#1a2744", muted: "#6B7FA3" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lato:wght@300;400;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Lato',sans-serif; background:${C.bg}; color:${C.text}; }
  h1,h2,h3,h4 { font-family:'Nunito',sans-serif; }
  input,select,textarea { font-family:'Lato',sans-serif; }
  ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#f0f0f0}
  ::-webkit-scrollbar-thumb{background:${C.blueLight};border-radius:3px}
  .fade-in{animation:fadeIn .3s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
`;

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px", boxShadow: "0 2px 8px rgba(74,111,165,.07)", ...style }}>{children}</div>
);
const StatBox = ({ label, value, prev, accent }) => {
  const p = pct(value, prev);
  return (
    <div style={{ background: accent ? C.blue : C.card, border: `1px solid ${accent ? C.blue : C.border}`, borderRadius: 12, padding: "16px 20px", flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: accent ? "rgba(255,255,255,.75)" : C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: accent ? "#fff" : C.text, fontFamily: "Nunito" }}>{typeof value === "number" && value > 999 ? fmt$(value) : value}</div>
      {prev !== undefined && <div style={{ marginTop: 4 }}><Arrow val={p} /></div>}
    </div>
  );
};
const Input = ({ label, value, onChange, type = "text", style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
    {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", background: "#fff" }}
      onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = C.border} />
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
  const v = { primary: { background: C.blue, color: "#fff" }, secondary: { background: C.bluePale, color: C.blue }, danger: { background: "#fee2e2", color: "#dc2626" }, success: { background: "#dcfce7", color: "#16a34a" } };
  return <button style={{ border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "Lato,sans-serif", opacity: disabled ? .6 : 1, ...v[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
};
const Badge = ({ children, color = C.blue }) => (
  <span style={{ background: color + "20", color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{children}</span>
);
const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: C.muted, borderBottom: `2px solid ${C.bluePale}`, paddingBottom: 6, marginBottom: 12 }}>{children}</div>
);
const Alert = ({ msg, type = "success" }) => {
  if (!msg) return null;
  const colors = { success: ["#f0fdf4", "#22c55e", "#15803d"], error: ["#fef2f2", "#ef4444", "#dc2626"], info: ["#eff6ff", "#3b82f6", "#1d4ed8"], warn: ["#fffbeb", "#f59e0b", "#92400e"] };
  const [bg, border, text] = colors[type];
  return <div style={{ background: bg, border: `1px solid ${border}`, color: text, borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 14, fontWeight: 600 }}>{msg}</div>;
};

// ── LOADING SCREEN ────────────────────────────────────────────────────────────
const Loader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.blueDark, flexDirection: "column", gap: 20 }}>
    <img src={LOGO} alt="Celebration Church" style={{ height: 80, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))", background: "rgba(255,255,255,0.9)", borderRadius: 12, padding: 8 }} />
    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}>Loading Celebration Church Portal…</div>
    <div style={{ width: 200, height: 3, background: "rgba(255,255,255,.1)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", background: C.accent, borderRadius: 2, animation: "load 1.5s ease-in-out infinite" }} />
    </div>
    <style>{`@keyframes load{0%{width:0}100%{width:100%}}`}</style>
  </div>
);

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true); setErr("");
    const ok = await onLogin(email.trim(), password.trim());
    if (!ok) { setErr("Invalid email or password."); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(150deg,${C.blueDark} 0%,${C.blue} 55%,${C.blueLight} 100%)`, display: "flex", alignItems: "stretch" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 48px", textAlign: "center" }}>
        <img src={LOGO} alt="Celebration Church" style={{ height: 140, marginBottom: 32, background: "rgba(255,255,255,0.95)", borderRadius: 20, padding: "16px 24px", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))" }} className="fade-in" />
        <h1 style={{ fontFamily: "Nunito,sans-serif", fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>Celebration Church</h1>
        <div style={{ width: 60, height: 3, background: C.accent, borderRadius: 2, marginBottom: 20 }} />
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", fontStyle: "italic", lineHeight: 1.7, maxWidth: 340 }}>
          "Building People, Building Dreams,<br />Building the Kingdom of God"
        </p>
        <div style={{ marginTop: 48, padding: "12px 24px", background: "rgba(255,255,255,0.1)", borderRadius: 30, border: "1px solid rgba(255,255,255,0.2)" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Statistics Portal</span>
        </div>
      </div>
      <div style={{ width: 420, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 44px", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
        <div className="fade-in" style={{ width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <img src={LOGO} alt="" style={{ height: 60, marginBottom: 12 }} />
            <h2 style={{ fontFamily: "Nunito,sans-serif", fontSize: 20, fontWeight: 900, color: C.blueDark, marginBottom: 4 }}>Welcome Back</h2>
            <p style={{ fontSize: 13, color: C.muted }}>Sign in to your account</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Email Address" value={email} onChange={setEmail} type="email" />
            <Input label="Password" value={password} onChange={setPassword} type="password" />
            {err && <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>{err}</div>}
            <Btn onClick={handle} disabled={loading} style={{ marginTop: 8, padding: "13px", fontSize: 15, borderRadius: 10, background: C.blueDark }}>
              {loading ? "Signing in…" : "Sign In →"}
            </Btn>
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
        <img src={LOGO} alt="" style={{ height: 44, background: "rgba(255,255,255,0.95)", borderRadius: 10, padding: "6px 10px" }} />
        <div style={{ fontSize: 10, color: C.accent, fontStyle: "italic", marginTop: 8, lineHeight: 1.5 }}>Building People,<br />Building Dreams,<br />Building the Kingdom of God</div>
      </div>
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {links.map(l => (
          <button key={l.id} onClick={() => setPage(l.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 20px", background: page === l.id ? "rgba(255,255,255,.12)" : "transparent", border: "none", color: page === l.id ? "#fff" : "rgba(255,255,255,.65)", fontWeight: page === l.id ? 700 : 400, fontSize: 14, cursor: "pointer", borderLeft: page === l.id ? `3px solid ${C.accent}` : "3px solid transparent", fontFamily: "Lato,sans-serif" }}>
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
const EMPTY_FORM = { adults: "", vip: "", children: "", salvations: "", rededications: "", tithe: "", offering: "", firstFruit: "", compassion: "", specialLabel: "", specialAmt: "", otherLabel: "", otherAmt: "", highlights: "" };

function EntryPage({ user, branches, onSaved }) {
  const today = new Date().toISOString().split("T")[0];
  const [branch, setBranch] = useState(user.branch || branches[0] || "");
  const [date, setDate]     = useState(today);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [err, setErr]       = useState("");

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const n   = k => Number(form[k]) || 0;
  const totalAtt = n("adults") + n("vip") + n("children");
  const totalOff = n("tithe") + n("offering") + n("firstFruit") + n("compassion") + n("specialAmt") + n("otherAmt");

  const submit = async () => {
    if (!branch) { setErr("Please select a branch."); return; }
    setSaving(true); setErr("");
    const entry = {
      id: `${branch}-${date}`, branch, date,
      attendance: { adults: n("adults"), vip: n("vip"), children: n("children") },
      alter_call: { salvations: n("salvations"), rededications: n("rededications") },
      offerings: { tithe: n("tithe"), offering: n("offering"), firstFruit: n("firstFruit"), compassion: n("compassion"), special: { label: form.specialLabel, amount: n("specialAmt") }, other: { label: form.otherLabel, amount: n("otherAmt") } },
      highlights: form.highlights,
    };
    try {
      await db.upsert("cc_stats", entry);
      setForm(EMPTY_FORM); setDate(today);
      setSaved(true); setTimeout(() => setSaved(false), 4000);
      onSaved(); // refresh parent stats
    } catch (e) { setErr("Save failed: " + e.message); }
    setSaving(false);
  };

  const row3 = children => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>{children}</div>;

  return (
    <div className="fade-in" style={{ maxWidth: 780, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Enter Service Statistics</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Record attendance, altar call results and offerings.</p>
      {saved && <Alert msg="✅ Statistics saved to the database! Form cleared for next entry." type="success" />}
      {err   && <Alert msg={err} type="error" />}

      <Card style={{ marginBottom: 20 }}>
        <SectionTitle>Service Details</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {user.role === "admin"
            ? <Select label="Branch" value={branch} onChange={setBranch} options={branches.length ? branches : [{ value: "", label: "— Add branches first —" }]} />
            : <div><label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>Branch</label><div style={{ padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.bluePale, fontWeight: 700, color: C.blue, marginTop: 4 }}>{branch}</div></div>
          }
          <Input label="Service Date" value={date} onChange={setDate} type="date" />
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Attendance</SectionTitle>
        {row3([
          <Input key="a" label="Adults"   value={form.adults}   onChange={v => upd("adults", v)}   type="number" />,
          <Input key="b" label="VIP"      value={form.vip}      onChange={v => upd("vip", v)}      type="number" />,
          <Input key="c" label="Children" value={form.children} onChange={v => upd("children", v)} type="number" />,
        ])}
        <div style={{ marginTop: 12, padding: "10px 14px", background: C.bluePale, borderRadius: 8, fontSize: 14, fontWeight: 700, color: C.blue }}>
          Total: <span style={{ fontSize: 18 }}>{totalAtt}</span>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Altar Call</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Salvations"     value={form.salvations}    onChange={v => upd("salvations", v)}    type="number" />
          <Input label="Re-dedications" value={form.rededications} onChange={v => upd("rededications", v)} type="number" />
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Offerings</SectionTitle>
        {row3([
          <Input key="t" label="Tithe ($)"       value={form.tithe}      onChange={v => upd("tithe", v)}      type="number" />,
          <Input key="o" label="Offering ($)"    value={form.offering}   onChange={v => upd("offering", v)}   type="number" />,
          <Input key="f" label="First Fruit ($)" value={form.firstFruit} onChange={v => upd("firstFruit", v)} type="number" />,
        ])}
        <div style={{ marginTop: 12 }}><Input label="Compassion ($)" value={form.compassion} onChange={v => upd("compassion", v)} type="number" /></div>
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
          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, minHeight: 90, resize: "vertical", fontFamily: "Lato,sans-serif" }} />
      </Card>

      <Btn onClick={submit} disabled={saving || !branch} style={{ padding: "12px 32px", fontSize: 15 }}>
        {saving ? "Saving…" : "Save Statistics"}
      </Btn>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardPage({ user, stats, branches }) {
  const [selBranch, setSelBranch] = useState(user.branch || "");
  const [selDate,   setSelDate]   = useState("");

  // 1. All dates across all stats (for dropdown)
  const allDates = [...new Set(stats.map(s => s.date))].sort().reverse();

  // 2. Default to latest available date
  const activeDate = selDate || allDates[0] || "";

  // 3. Filter stats to the active date
  const statsForDate = stats.filter(s => s.date === activeDate);

  // 4. Further filter by branch if one is selected
  const isAdmin      = user.role === "admin";
  const activeBranch = isAdmin ? selBranch : user.branch;
  const filteredStats = activeBranch
    ? statsForDate.filter(s => s.branch === activeBranch)
    : statsForDate; // all branches for admin with no branch selected

  // 5. Sum everything in filteredStats → these are the KPI totals
  const totals = filteredStats.reduce((acc, s) => {
    const ac = s.alter_call || s.alterCall || {};
    return {
      adults:        acc.adults        + (s.attendance.adults    || 0),
      vip:           acc.vip           + (s.attendance.vip       || 0),
      children:      acc.children      + (s.attendance.children  || 0),
      salvations:    acc.salvations    + (ac.salvations           || 0),
      rededications: acc.rededications + (ac.rededications        || 0),
      offerings:     acc.offerings     + totalOfferings(s),
    };
  }, { adults: 0, vip: 0, children: 0, salvations: 0, rededications: 0, offerings: 0 });

  const totalAtt = totals.adults + totals.vip + totals.children;

  // 6. Previous date totals for comparison arrows
  const prevDate   = allDates[allDates.indexOf(activeDate) + 1] || "";
  const prevStats  = prevDate
    ? stats.filter(s => s.date === prevDate && (activeBranch ? s.branch === activeBranch : true))
    : [];
  const prevTotals = prevStats.reduce((acc, s) => {
    const ac = s.alter_call || s.alterCall || {};
    return {
      adults:     acc.adults     + (s.attendance.adults   || 0),
      vip:        acc.vip        + (s.attendance.vip      || 0),
      children:   acc.children   + (s.attendance.children || 0),
      salvations: acc.salvations + (ac.salvations          || 0),
      offerings:  acc.offerings  + totalOfferings(s),
    };
  }, { adults: 0, vip: 0, children: 0, salvations: 0, offerings: 0 });
  const prevTotalAtt = prevTotals.adults + prevTotals.vip + prevTotals.children;
  const hasPrev = prevStats.length > 0;

  // 7. Trend chart — last 10 dates, summed per date for the active branch filter
  const trendDates = allDates.slice(0, 10).reverse();
  const chartData  = trendDates.map(d => {
    const ds = stats.filter(s => s.date === d && (activeBranch ? s.branch === activeBranch : true));
    const sum = ds.reduce((a, s) => {
      const ac = s.alter_call || s.alterCall || {};
      return {
        adults:   a.adults   + (s.attendance.adults   || 0),
        children: a.children + (s.attendance.children || 0),
        vip:      a.vip      + (s.attendance.vip      || 0),
        total:    a.total    + totalOfferings(s),
        tithe:    a.tithe    + (s.offerings.tithe     || 0),
      };
    }, { adults: 0, children: 0, vip: 0, total: 0, tithe: 0 });
    return { date: d.slice(5), Adults: sum.adults, Children: sum.children, VIP: sum.vip, Total: sum.total, Tithe: sum.tithe };
  });

  const PIE_COLORS = [C.blue, C.accent, C.blueLight];
  const pieData = [
    { name: "Adults",   value: totals.adults },
    { name: "VIP",      value: totals.vip },
    { name: "Children", value: totals.children },
  ];

  if (!activeDate) return (
    <Card><p style={{ color: C.muted, padding: "12px 0" }}>No stats recorded yet. Use "Enter Stats" to add your first service.</p></Card>
  );

  return (
    <div className="fade-in">
      {/* Header + Filters */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900 }}>
            {isAdmin ? (activeBranch || "All Branches") : user.branch} Dashboard
          </h2>
          <p style={{ color: C.muted, fontSize: 13 }}>
            Date: <strong>{activeDate}</strong>
            {hasPrev && <span style={{ marginLeft: 8, color: C.muted }}>· prev: {prevDate}</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {isAdmin && (
            <Select value={selBranch} onChange={setSelBranch}
              options={[{ value: "", label: "All Branches" }, ...branches.map(b => ({ value: b, label: b }))]} />
          )}
          <Select value={selDate} onChange={setSelDate}
            options={[...allDates.map(d => ({ value: d, label: d }))]} />
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatBox label="Total Attendance" value={totalAtt}         prev={hasPrev ? prevTotalAtt         : undefined} accent />
        <StatBox label="Adults"           value={totals.adults}    prev={hasPrev ? prevTotals.adults    : undefined} />
        <StatBox label="VIP"              value={totals.vip}       prev={hasPrev ? prevTotals.vip       : undefined} />
        <StatBox label="Children"         value={totals.children}  prev={hasPrev ? prevTotals.children  : undefined} />
        <StatBox label="Salvations"       value={totals.salvations} prev={hasPrev ? prevTotals.salvations : undefined} />
        <StatBox label="Total Offerings"  value={totals.offerings} prev={hasPrev ? prevTotals.offerings : undefined} />
      </div>

      {/* Comparison + Pie */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle>vs Previous Service {hasPrev && `(${prevDate})`}</SectionTitle>
          {hasPrev ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr>{["Metric","This Week","Last Week","Δ"].map(h =>
                <th key={h} style={{ textAlign:"left", padding:"4px 8px", color:C.muted, fontWeight:700, fontSize:11 }}>{h}</th>
              )}</tr></thead>
              <tbody>
                {[
                  ["Total Attendance", totalAtt,           prevTotalAtt],
                  ["Adults",           totals.adults,      prevTotals.adults],
                  ["Children",         totals.children,    prevTotals.children],
                  ["Salvations",       totals.salvations,  prevTotals.salvations],
                  ["Offerings",        fmt$(totals.offerings), fmt$(prevTotals.offerings)],
                ].map(([m,a,b]) => (
                  <tr key={m} style={{ borderTop:`1px solid ${C.border}` }}>
                    <td style={{ padding:"7px 8px", fontWeight:600 }}>{m}</td>
                    <td style={{ padding:"7px 8px", color:C.blue, fontWeight:700 }}>{a}</td>
                    <td style={{ padding:"7px 8px", color:C.muted }}>{b}</td>
                    <td style={{ padding:"7px 8px" }}><Arrow val={pct(Number(String(a).replace(/[$,]/g,"")), Number(String(b).replace(/[$,]/g,"")))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color:C.muted, fontSize:13 }}>No previous service data to compare.</p>}
        </Card>
        <Card>
          <SectionTitle>Attendance Breakdown — {activeDate}</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70}
                label={({name,percent}) => percent > 0 ? `${name} ${(percent*100).toFixed(0)}%` : ""}
                labelLine={false} fontSize={11}>
                {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%3]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trend Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Attendance Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fontSize:11, fill:C.muted }} />
              <YAxis tick={{ fontSize:11, fill:C.muted }} />
              <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} />
              <Bar dataKey="Adults"   fill={C.blue}      radius={[4,4,0,0]} />
              <Bar dataKey="Children" fill={C.blueLight} radius={[4,4,0,0]} />
              <Bar dataKey="VIP"      fill={C.accent}    radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>Offerings Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fontSize:11, fill:C.muted }} />
              <YAxis tick={{ fontSize:11, fill:C.muted }} />
              <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} formatter={v=>fmt$(v)} />
              <Line type="monotone" dataKey="Total" stroke={C.blue}   strokeWidth={2.5} dot={{r:4}} />
              <Line type="monotone" dataKey="Tithe" stroke={C.accent} strokeWidth={2}   dot={{r:3}} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Branch breakdown table — only when All Branches selected */}
      {isAdmin && !activeBranch && (
        <Card>
          <SectionTitle>Branch Breakdown — {activeDate}</SectionTitle>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:C.bluePale }}>
                {["Branch","Adults","VIP","Children","Total Att.","Salvations","Re-ded.","Offerings"].map(h => (
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:800, color:C.muted, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branches.map(b => {
                const s = statsForDate.find(x => x.branch === b);
                const ac = s ? (s.alter_call || s.alterCall || {}) : {};
                return (
                  <tr key={b} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:"9px 12px", fontWeight:700 }}>{b}</td>
                    {s ? <>
                      <td style={{ padding:"9px 12px" }}>{s.attendance.adults}</td>
                      <td style={{ padding:"9px 12px" }}>{s.attendance.vip}</td>
                      <td style={{ padding:"9px 12px" }}>{s.attendance.children}</td>
                      <td style={{ padding:"9px 12px", fontWeight:700, color:C.blue }}>{totalAttendance(s)}</td>
                      <td style={{ padding:"9px 12px" }}>{ac.salvations||0}</td>
                      <td style={{ padding:"9px 12px" }}>{ac.rededications||0}</td>
                      <td style={{ padding:"9px 12px", fontWeight:700, color:C.blue }}>{fmt$(totalOfferings(s))}</td>
                    </> : <td colSpan={7} style={{ padding:"9px 12px", color:C.muted, fontStyle:"italic" }}>No data submitted</td>}
                  </tr>
                );
              })}
              <tr style={{ background:C.bluePale, fontWeight:800 }}>
                <td style={{ padding:"9px 12px" }}>TOTAL</td>
                <td style={{ padding:"9px 12px" }}>{totals.adults}</td>
                <td style={{ padding:"9px 12px" }}>{totals.vip}</td>
                <td style={{ padding:"9px 12px" }}>{totals.children}</td>
                <td style={{ padding:"9px 12px", color:C.blue }}>{totalAtt}</td>
                <td style={{ padding:"9px 12px" }}>{totals.salvations}</td>
                <td style={{ padding:"9px 12px" }}>{totals.rededications}</td>
                <td style={{ padding:"9px 12px", color:C.blue }}>{fmt$(totals.offerings)}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ── CONSOLIDATED ──────────────────────────────────────────────────────────────
function ConsolidatedPage({ stats, branches }) {
  const [filterDate, setFilterDate] = useState("");
  const dates    = [...new Set(stats.map(s => s.date))].sort().reverse();
  const selDate  = filterDate || dates[0];
  const filtered = stats.filter(s => s.date === selDate);

  const totals = filtered.reduce((acc, s) => {
    const ac = s.alter_call || s.alterCall || {};
    return { adults: acc.adults + s.attendance.adults, children: acc.children + s.attendance.children, vip: acc.vip + s.attendance.vip, salvations: acc.salvations + (ac.salvations || 0), rededications: acc.rededications + (ac.rededications || 0), offerings: acc.offerings + totalOfferings(s) };
  }, { adults: 0, children: 0, vip: 0, salvations: 0, rededications: 0, offerings: 0 });

  const barData = branches.map(b => {
    const s = filtered.find(x => x.branch === b);
    return { branch: b.split(" ")[0], attendance: s ? totalAttendance(s) : 0, offerings: s ? totalOfferings(s) : 0 };
  });

  if (!dates.length) return <Card><p style={{ color: C.muted }}>No stats recorded yet.</p></Card>;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 22, fontWeight: 900 }}>Consolidated Dashboard</h2><p style={{ color: C.muted, fontSize: 13 }}>All branches combined</p></div>
        <Select value={selDate} onChange={setFilterDate} options={dates.map(d => ({ value: d, label: d }))} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatBox label="Total Attendance"  value={totals.adults + totals.children + totals.vip} accent />
        <StatBox label="Adults"            value={totals.adults} />
        <StatBox label="Children"          value={totals.children} />
        <StatBox label="Salvations"        value={totals.salvations} />
        <StatBox label="Re-dedications"    value={totals.rededications} />
        <StatBox label="Total Offerings"   value={totals.offerings} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Attendance by Branch</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="branch" tick={{ fontSize: 11, fill: C.muted }} /><YAxis tick={{ fontSize: 11, fill: C.muted }} /><Tooltip /><Bar dataKey="attendance" fill={C.blue} radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>Offerings by Branch</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="branch" tick={{ fontSize: 11, fill: C.muted }} /><YAxis tick={{ fontSize: 11, fill: C.muted }} /><Tooltip formatter={v => fmt$(v)} /><Bar dataKey="offerings" fill={C.accent} radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle>Branch Summary — {selDate}</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: C.bluePale }}>{["Branch", "Adults", "VIP", "Children", "Total Att.", "Salvations", "Re-ded.", "Offerings"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {branches.map(b => {
              const s = filtered.find(x => x.branch === b);
              const ac = s ? (s.alter_call || s.alterCall || {}) : {};
              return (
                <tr key={b} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "9px 12px", fontWeight: 700 }}>{b}</td>
                  {s ? <>
                    <td style={{ padding: "9px 12px" }}>{s.attendance.adults}</td>
                    <td style={{ padding: "9px 12px" }}>{s.attendance.vip}</td>
                    <td style={{ padding: "9px 12px" }}>{s.attendance.children}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 700, color: C.blue }}>{totalAttendance(s)}</td>
                    <td style={{ padding: "9px 12px" }}>{ac.salvations || 0}</td>
                    <td style={{ padding: "9px 12px" }}>{ac.rededications || 0}</td>
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
function AdminPage({ branches, setBranches, stats, setStats, refreshAll }) {
  const [tab, setTab]           = useState("users");
  const [users, setUsers]       = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [emailStatus, setEmailStatus]  = useState(null);
  const [saveMsg, setSaveMsg]   = useState({ text: "", type: "success" });
  const [uForm, setUForm]       = useState({ name: "", email: "", role: "capturer", branch: "", password: "" });
  const [editUId, setEditUId]   = useState(null);
  const [newBranch, setNewBranch] = useState("");
  const upd = (k, v) => setUForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    db.get("cc_users", "order=id.asc").then(data => { setUsers(data); setLoadingUsers(false); }).catch(() => setLoadingUsers(false));
  }, []);

  const showMsg = (text, type = "success") => { setSaveMsg({ text, type }); setTimeout(() => setSaveMsg({ text: "", type: "success" }), 10000); };
  const clearForm = () => setUForm({ name: "", email: "", role: "capturer", branch: branches[0] || "", password: "" });

  const saveUser = async () => {
    if (!uForm.name || !uForm.email || !uForm.password) { showMsg("❌ Name, email and password are required.", "error"); return; }
    const cleanUser = { name: uForm.name.trim(), email: uForm.email.trim().toLowerCase(), password: uForm.password.trim(), role: uForm.role, branch: uForm.role === "admin" ? null : (uForm.branch || branches[0] || "") };
    try {
      if (editUId) {
        const [updated] = await db.update("cc_users", { id: editUId }, cleanUser);
        setUsers(us => us.map(u => u.id === editUId ? updated : u));
        setEditUId(null);
        showMsg(`✅ "${cleanUser.name}" updated — login: ${cleanUser.email} / ${cleanUser.password}`);
      } else {
        const [created] = await db.insert("cc_users", cleanUser);
        setUsers(us => [...us, created]);
        showMsg(`✅ "${cleanUser.name}" created — login: ${cleanUser.email} / ${cleanUser.password}`);
        setEmailStatus("sending");
        const r = await sendWelcomeEmail({ toName: cleanUser.name, toEmail: cleanUser.email, password: cleanUser.password, role: cleanUser.role, branch: cleanUser.branch, appUrl: window.location.origin });
        setEmailStatus(r.ok ? "sent" : (r.reason === "not configured" ? "unconfigured" : "error"));
        setTimeout(() => setEmailStatus(null), 7000);
      }
      clearForm();
    } catch (e) { showMsg("❌ " + e.message, "error"); }
  };

  const editUser   = u => { setUForm({ name: u.name, email: u.email, role: u.role, branch: u.branch || "", password: u.password }); setEditUId(u.id); };
  const deleteUser = async id => {
    if (!window.confirm("Delete this user?")) return;
    await db.delete("cc_users", { id });
    setUsers(us => us.filter(u => u.id !== id));
  };

  const addBranch = async () => {
    const b = newBranch.trim();
    if (!b || branches.includes(b)) return;
    await db.insert("cc_branches", { name: b });
    setBranches(bs => [...bs, b]); setNewBranch("");
  };

  const removeBranch = async b => {
    if (!window.confirm(`Remove branch "${b}"? Stats for this branch will remain.`)) return;
    await db.delete("cc_branches", { name: b });
    setBranches(bs => bs.filter(x => x !== b));
  };

  const deleteStat = async id => {
    if (!window.confirm("Delete this stat record?")) return;
    await db.delete("cc_stats", { id });
    setStats(ss => ss.filter(s => s.id !== id));
  };

  const tabs = [{ id: "users", label: "👥 Users" }, { id: "branches", label: "🏛️ Branches" }, { id: "stats", label: "📋 Stats Log" }];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Admin Portal</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Manage users, branches and data — all changes sync instantly across devices.</p>

      {saveMsg.text && <Alert msg={saveMsg.text} type={saveMsg.type} />}
      {emailStatus === "sending"      && <Alert msg="📧 Sending welcome email…" type="info" />}
      {emailStatus === "sent"         && <Alert msg="✅ Welcome email sent!" type="success" />}
      {emailStatus === "error"        && <Alert msg="❌ Email failed — share the login details from the green banner above manually." type="error" />}
      {emailStatus === "unconfigured" && <Alert msg="⚠️ User created. Configure EmailJS to auto-send emails." type="warn" />}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: `2px solid ${C.border}` }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ border: "none", background: "transparent", padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Lato,sans-serif", color: tab === t.id ? C.blue : C.muted, borderBottom: tab === t.id ? `2px solid ${C.blue}` : "2px solid transparent", marginBottom: -2 }}>{t.label}</button>)}
      </div>

      {tab === "users" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 16 }}>
            <Card>
              <SectionTitle>{editUId ? "Edit User" : "Add New User"}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Input label="Full Name" value={uForm.name}     onChange={v => upd("name", v)} />
                <Input label="Email"     value={uForm.email}    onChange={v => upd("email", v)}    type="email" />
                <Input label="Password"  value={uForm.password} onChange={v => upd("password", v)} />
                <Select label="Role" value={uForm.role} onChange={v => upd("role", v)} options={[{ value: "capturer", label: "Data Capturer" }, { value: "admin", label: "Administrator" }]} />
                {uForm.role === "capturer" && <Select label="Branch" value={uForm.branch} onChange={v => upd("branch", v)} options={branches.length ? branches : [{ value: "", label: "— Add branches first —" }]} />}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <Btn onClick={saveUser}>{editUId ? "Update User" : "Add User"}</Btn>
                  {editUId && <Btn variant="secondary" onClick={() => { setEditUId(null); clearForm(); }}>Cancel</Btn>}
                </div>
              </div>
            </Card>
            <Card>
              <SectionTitle>All Users ({users.length})</SectionTitle>
              {loadingUsers ? <p style={{ color: C.muted, fontSize: 13 }}>Loading…</p> : (
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
                            <Btn variant="secondary" onClick={() => editUser(u)}      style={{ padding: "4px 10px", fontSize: 11 }}>Edit</Btn>
                            <Btn variant="danger"    onClick={() => deleteUser(u.id)} style={{ padding: "4px 10px", fontSize: 11 }}>Del</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
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
            {!branches.length && <p style={{ color: C.muted, fontSize: 13 }}>No branches yet.</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {branches.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: C.bluePale, borderRadius: 8 }}>
                  <span style={{ fontWeight: 600 }}>🏛️ {b}</span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Badge color={C.blue}>{stats.filter(s => s.branch === b).length} records</Badge>
                    <Btn variant="danger" onClick={() => removeBranch(b)} style={{ padding: "4px 10px", fontSize: 11 }}>Remove</Btn>
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
          {!stats.length && <p style={{ color: C.muted, fontSize: 13 }}>No stats recorded yet.</p>}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
              <thead><tr style={{ background: C.bluePale }}>{["Date", "Branch", "Adults", "VIP", "Children", "Total Att.", "Salvations", "Offerings", ""].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontSize: 10, fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
              <tbody>
                {[...stats].sort((a, b) => b.date.localeCompare(a.date)).map(s => {
                  const ac = s.alter_call || s.alterCall || {};
                  return (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "7px 10px" }}>{s.date}</td>
                      <td style={{ padding: "7px 10px", fontWeight: 600 }}>{s.branch}</td>
                      <td style={{ padding: "7px 10px" }}>{s.attendance.adults}</td>
                      <td style={{ padding: "7px 10px" }}>{s.attendance.vip}</td>
                      <td style={{ padding: "7px 10px" }}>{s.attendance.children}</td>
                      <td style={{ padding: "7px 10px", fontWeight: 700, color: C.blue }}>{totalAttendance(s)}</td>
                      <td style={{ padding: "7px 10px" }}>{ac.salvations || 0}</td>
                      <td style={{ padding: "7px 10px", fontWeight: 700, color: C.blue }}>{fmt$(totalOfferings(s))}</td>
                      <td style={{ padding: "7px 10px" }}><Btn variant="danger" onClick={() => deleteStat(s.id)} style={{ padding: "3px 8px", fontSize: 10 }}>Delete</Btn></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(null);
  const [page, setPage]       = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [stats, setStats]     = useState([]);
  const [branches, setBranches] = useState([]);

  // Load stats + branches from Supabase
  const loadData = async () => {
    try {
      const [s, b] = await Promise.all([
        db.get("cc_stats",    "order=date.desc"),
        db.get("cc_branches", "order=name.asc"),
      ]);
      setStats(s);
      setBranches(b.map(x => x.name));
    } catch (e) { console.error("Load error:", e); }
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  // Login: query Supabase directly — works on every device
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await db.get("cc_users", `email=eq.${encodeURIComponent(email)}&password=eq.${encodeURIComponent(password)}&limit=1`);
      if (data.length) { setUser(data[0]); setPage("dashboard"); setLoading(false); return true; }
    } catch (e) { console.error("Login error:", e); }
    setLoading(false);
    return false;
  };

  if (loading) return <><style>{css}</style><Loader /></>;

  if (!user) return (
    <><style>{css}</style><LoginScreen onLogin={handleLogin} /></>
  );

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar page={page} setPage={setPage} user={user} onLogout={() => { setUser(null); setStats([]); setBranches([]); }} />
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxHeight: "100vh" }}>
          {page === "dashboard"    && <DashboardPage    user={user} stats={stats} branches={branches} />}
          {page === "entry"        && <EntryPage        user={user} branches={branches} onSaved={loadData} />}
          {page === "consolidated" && user.role === "admin" && <ConsolidatedPage stats={stats} branches={branches} />}
          {page === "admin"        && user.role === "admin" && <AdminPage branches={branches} setBranches={setBranches} stats={stats} setStats={setStats} refreshAll={loadData} />}
        </main>
      </div>
    </>
  );
}
