import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/userUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import { API_PATHS } from "../../utills/apiPath";
import moment from "moment";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utills/helper";
import { LuArrowRight, LuCalendar, LuTrendingUp, LuCheck, LuClock, LuLoader } from "react-icons/lu";
import TaskLishTable from "../../components/layouts/TaskLishTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Deshboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  const prepareChartData = (data) => {
    const taskDistribution = data.taskDistribution || {};
    const taskPriorityLevels = data.taskPriorityLevels || {};

    setPieChartData([
      { status: "Pending", count: taskDistribution.Pending || 0 },
      { status: "In Progress", count: taskDistribution.InProgress || 0 },
      { status: "Completed", count: taskDistribution.Completed || 0 },
    ]);

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels.Medium || 0 },
      { priority: "High", count: taskPriorityLevels.High || 0 },
    ]);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Good Morning, {user?.name?.split(' ')[0] || "Admin"}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <LuCalendar className="w-4 h-4" />
              {moment().format("dddd, MMMM Do YYYY")}
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            <LuTrendingUp className="w-3 h-3 mr-1" />
            Admin Dashboard
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Tasks
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <LuTrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.all || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All time tasks
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending Tasks
            </CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <LuClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              In Progress
            </CardTitle>
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
              <LuLoader className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completed
            </CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <LuCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Done & dusted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Overview of task statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Priority Levels</CardTitle>
            <CardDescription>Tasks by priority</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={barChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest tasks in the system</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onSeeMore}>
            See All
            <LuArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <TaskLishTable tableData={dashboardData?.recentTasks || []} />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Deshboard;