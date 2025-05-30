import income from "./assets/images/coupon.png";
import profileUser from "./assets/images/profileuser.png";
import DailyOverViewChart from "./Components/DailyOverViewChart/DailyOverViewChart";
import IncomeOverview from "./Components/IncomeOverview/IncomeOverview";
import { Link } from "react-router-dom";
import "./App.css";
import activeUser from "./assets/images/premium.png";
import referrals from "./assets/images/business.png";
import { Table } from "antd";
import {
  useGetDashboardQuery,
  useRecentTransactionQuery,
} from "./redux/api/dahsboadHomeApi";
import { useState } from "react";
import { useGetProfileQuery } from "./redux/api/authApi";
import { useBusinessAnalyticsQuery } from "./redux/api/couponManagement";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { CiShare2 } from "react-icons/ci";
import { MdOutlineExplore } from "react-icons/md";
import { FcExpired } from "react-icons/fc";
import { ImProfile } from "react-icons/im";
import { RxValue } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import { TbCurrencyPeso } from "react-icons/tb";
import { FaDollarSign } from "react-icons/fa";
import { useAppContext } from "./context/AppContext";
function App() {
  const { t } = useTranslation();
  const { currency, setCurrency } = useAppContext();

  const { data: getUserInfo, isError, isLoading } = useGetProfileQuery();
  const { data: getBusinessAnalytics } = useBusinessAnalyticsQuery();

  const [subscriptionYear, setSubscriptionYear] = useState(
    new Date().getFullYear()
  );
  const [userYear, setUserYear] = useState(new Date().getFullYear());
  // Handle Subscription growth year
  const handleChangeYear = (value) => {
    setSubscriptionYear(value);
  };

  // Handle user growth year function

  const handleUserGrowth = (value) => {
    setUserYear(value);
  };

  const { data: getDashboardInfo } = useGetDashboardQuery({
    subscription_year: subscriptionYear,
    user_year: userYear,
  });
  const { data: recentTransaction } = useRecentTransactionQuery();
  //

  // console.log(getDashboardInfo?.data?.redeemed_coupons);
  const data = [
    {
      title: t("totalUser"),
      icon: profileUser,
      count: getDashboardInfo?.data?.total_users,
      path: "/user-management",
    },
    {
      title: t("premiumUser"),
      icon: activeUser,
      count: getDashboardInfo?.data?.premium_users,
      path: "/premium-use",
    },
    {
      title: t("totalBusinessOwners"),
      icon: referrals,
      count: getDashboardInfo?.data?.business_owners,
      path: "/business-owners",
    },
    {
      title: t("totalCoupon"),
      icon: income,
      count: getDashboardInfo?.data?.coupons,
    },
    {
      title: t("redeemedCoupon"),
      icon: income,
      count: getDashboardInfo?.data?.redeemed_coupons,
    },
  ];

  // Business Analytics data
  const businessAnalyticsData = [
    {
      title: t("totalDownload"),
      icon: <IoCloudDownloadOutline />,
      count: getBusinessAnalytics?.data?.total_downloads,
    },
    {
      title: t("totalShare"),
      icon: <CiShare2 />,
      count: getBusinessAnalytics?.data?.total_shares,
    },
    {
      title: t("clickToExplore"),
      icon: <MdOutlineExplore />,
      count: getBusinessAnalytics?.data?.click_to_explore,
    },
    {
      title: t("expiredCoupon"),
      icon: <FcExpired />,
      count: getBusinessAnalytics?.data?.expired_coupons,
    },
    {
      title: t("profileVisit"),
      icon: <ImProfile />,
      count: getBusinessAnalytics?.data?.profile_visits,
    },
    {
      title: t("value"),
      icon: <RxValue />,
      count: getBusinessAnalytics?.data?.value,
    },
  ];

  // table data
  const formattedData = recentTransaction?.data
    ?.slice(0, 3)
    ?.map((transaction) => {
      return {
        key: transaction?._id,
        useName: transaction?.user?.name,
        companyName: transaction?.coupon?.createdBy?.companyName,
        couponImage: transaction?.coupon?.photo_url,
        couponExpire: transaction?.coupon?.end?.split("T")?.[0],
        share: transaction?.coupon?.shareCount,
        download: transaction?.coupon?.redeemCount,
        promoTitle: transaction?.coupon?.promo_title,
        discountAmount: transaction?.coupon?.discount_amount,
        regularAmount: transaction?.coupon?.regular_amount,
        discountPercent: transaction?.coupon?.discount_percentage,
        date: transaction?.createdAt?.split("T")?.[0],
        mxnAmount: transaction?.coupon?.mxn_amount,
      };
    });

  // Table data
  const columns = [
    {
      title: "SL No.",
      dataIndex: "key",
      key: "key",
    },

    {
      title: <>{t("userName")}</>,
      dataIndex: "useName",
      key: "useName",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2">
            <p className="font-medium">{record?.useName}</p>
          </div>
        );
      },
    },
    {
      title: <>{t("companyName")}</>,
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: <>{t("coupon")}</>,
      dataIndex: "coupon",
      key: "coupon",
      render: (_, record) => {
        const {
          couponImage,
          couponExpire,
          promoTitle,
          discountPercent,
          discountAmount,
          regularAmount,
          mxnAmount,
        } = record;

        let displayText = "";

        if (promoTitle) {
          displayText = promoTitle;
        } else if (discountPercent) {
          displayText = `${discountPercent}% Off`;
        } else if (discountAmount) {
          if (currency === "us") {
            displayText = (
              <div className="flex items-center">
                <FaDollarSign />
                {discountAmount}
              </div>
            );
          } else {
            displayText = (
              <div className="flex items-center">
                <TbCurrencyPeso /> {mxnAmount}
              </div>
            );
          }
        }

        return (
          <div className="border border-dashed px-2 py-2 flex items-center justify-between max-w-[300px]">
            <div>
              <img src={couponImage} className="h-12 w-12 mt-2" alt="Coupon" />
              <p className="mt-1 text-sm text-gray-500">
                Expires {couponExpire}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-xl">
                {displayText}
                {discountAmount && regularAmount && (
                  <span className="text-gray-500 text-sm line-through ml-1">
                    {regularAmount}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: <>{t("redeemCount")}</>,
      dataIndex: "download",
      key: "download",
    },
    {
      title: <>{t("share")}</>,
      dataIndex: "share",
      key: "share",
    },
    {
      title: <>{t("date")}</>,
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div>
      {getUserInfo?.data?.role === "admin" ? (
        <div>
          {/*  statistics card for dashboard home page */}
          <div className="grid grid-cols-1 md:grid-cols-5 justify-center items-center gap-5">
            {data?.map((item, index) => (
              <Link to={item?.path}>
                <div
                  className="w-full h-full flex hover:shadow-md justify-center items-center  flex-col gap-3 py-7 bg-[#FEFEFE] p-2 rounded-md"
                  key={index}
                >
                  <p className="text-2xl font-medium">{item?.title}</p>
                  <img src={item?.icon} className="my-[5px]" />
                  <p className="text-3xl font-semibold">{item?.count}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
            <div className="w-full h-full bg-white p-0 md:p-4 rounded-md">
              <IncomeOverview
                subscriptionGrowth={getDashboardInfo?.data?.subscription_growth}
                handleChangeYear={handleChangeYear}
              />
            </div>
            <div className="w-full h-full bg-white p-0 md:p-4 rounded-md">
              <DailyOverViewChart
                userGrowth={getDashboardInfo?.data?.user_growth}
                handleUserGrowth={handleUserGrowth}
              />
            </div>
          </div>

          <div className="bg-white shadow-md p-0 md:p-4 mt-5 rounded-md">
            {/* Referral Overview section */}
            <div className="flex  justify-between items-center my-5 px-2 ">
              <p className="text-xl font-semibold">{t("recentTransactions")}</p>{" "}
              <Link to={`/all-referral`}>{t("viewAll")}</Link>
            </div>
            <Table
              dataSource={formattedData}
              columns={columns}
              className="custom-pagination"
              pagination={false}
              scroll={{ x: 800 }}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center gap-5">
          {businessAnalyticsData?.map((item, index) => (
            <div
              className="w-full h-full  text-center 
                 bg-[#FEFEFE] py-10 rounded-md"
              key={index}
            >
              <p className="text-2xl font-medium">{item?.title}</p>
              <p className="text-2xl  text-[#CD9B3A] flex justify-center">
                {item?.icon}
              </p>
              <p className="text-3xl font-semibold">{item?.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
