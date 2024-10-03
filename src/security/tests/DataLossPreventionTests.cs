using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using Microsoft.Office.Interop.Excel;
using Microsoft.Excel.Security.DLP;
using Microsoft.Excel.Security.Compliance;

namespace Microsoft.Excel.Security.Tests
{
    [TestClass]
    public class DataLossPreventionTests
    {
        private DataLossPreventionService _dlpService;
        private Mock<ContentScanner> _mockContentScanner;
        private Mock<ClassificationEngine> _mockClassificationEngine;
        private Mock<ComplianceService> _mockComplianceService;

        [TestInitialize]
        public void TestInitialize()
        {
            // Initialize mock objects
            _mockContentScanner = new Mock<ContentScanner>();
            _mockClassificationEngine = new Mock<ClassificationEngine>();
            _mockComplianceService = new Mock<ComplianceService>();

            // Set up the DataLossPreventionService instance with mock dependencies
            _dlpService = new DataLossPreventionService(
                _mockContentScanner.Object,
                _mockClassificationEngine.Object,
                _mockComplianceService.Object
            );
        }

        [TestMethod]
        public void TestScanWorkbook_SensitiveDataPresent()
        {
            // Arrange: Set up mock workbook with sensitive data
            var mockWorkbook = new Mock<Workbook>();
            var mockWorksheet = new Mock<Worksheet>();
            var mockRange = new Mock<Range>();

            mockWorkbook.Setup(wb => wb.Worksheets).Returns(new Sheets { mockWorksheet.Object });
            mockWorksheet.Setup(ws => ws.UsedRange).Returns(mockRange.Object);
            mockRange.Setup(r => r.Value2).Returns(new object[,] { { "Sensitive Data" } });

            _mockContentScanner.Setup(cs => cs.ScanContent(It.IsAny<string>()))
                .Returns(new List<string> { "PII" });

            // Act: Call ScanWorkbook method
            var result = _dlpService.ScanWorkbook(mockWorkbook.Object);

            // Assert: Verify correct detection of sensitive data
            Assert.IsTrue(result.ContainsSensitiveData);
            Assert.AreEqual(1, result.SensitiveDataLocations.Count);
            Assert.AreEqual("PII", result.SensitiveDataLocations[0].Classification);
        }

        [TestMethod]
        public void TestApplyDLPPolicies()
        {
            // Arrange: Set up mock workbook and DLP policies
            var mockWorkbook = new Mock<Workbook>();
            var mockWorksheet = new Mock<Worksheet>();
            var mockRange = new Mock<Range>();

            mockWorkbook.Setup(wb => wb.Worksheets).Returns(new Sheets { mockWorksheet.Object });
            mockWorksheet.Setup(ws => ws.UsedRange).Returns(mockRange.Object);
            mockRange.Setup(r => r.Value2).Returns(new object[,] { { "Sensitive Data" } });

            var dlpPolicies = new List<DLPPolicy>
            {
                new DLPPolicy { Classification = "PII", Action = DLPAction.Encrypt }
            };

            _mockClassificationEngine.Setup(ce => ce.ClassifyContent(It.IsAny<string>()))
                .Returns("PII");

            // Act: Call ApplyDLPPolicies method
            _dlpService.ApplyDLPPolicies(mockWorkbook.Object, dlpPolicies);

            // Assert: Verify policies are applied correctly
            mockRange.Verify(r => r.Cells.Encrypt(), Times.Once);
        }

        [TestMethod]
        public void TestClassifyWorkbook()
        {
            // Arrange: Set up mock workbook with mixed sensitivity data
            var mockWorkbook = new Mock<Workbook>();
            var mockWorksheet = new Mock<Worksheet>();
            var mockRange = new Mock<Range>();

            mockWorkbook.Setup(wb => wb.Worksheets).Returns(new Sheets { mockWorksheet.Object });
            mockWorksheet.Setup(ws => ws.UsedRange).Returns(mockRange.Object);
            mockRange.Setup(r => r.Value2).Returns(new object[,] { { "Public Data" }, { "Confidential Data" } });

            _mockClassificationEngine.Setup(ce => ce.ClassifyContent("Public Data"))
                .Returns("Public");
            _mockClassificationEngine.Setup(ce => ce.ClassifyContent("Confidential Data"))
                .Returns("Confidential");

            // Act: Call ClassifyWorkbook method
            var result = _dlpService.ClassifyWorkbook(mockWorkbook.Object);

            // Assert: Verify correct classification of workbook
            Assert.AreEqual("Confidential", result.OverallClassification);
            Assert.AreEqual(2, result.ClassificationBreakdown.Count);
            Assert.IsTrue(result.ClassificationBreakdown.ContainsKey("Public"));
            Assert.IsTrue(result.ClassificationBreakdown.ContainsKey("Confidential"));
        }

        [TestMethod]
        public void TestEnforceComplianceRules()
        {
            // Arrange: Set up mock workbook with highly sensitive data
            var mockWorkbook = new Mock<Workbook>();
            var mockWorksheet = new Mock<Worksheet>();
            var mockRange = new Mock<Range>();

            mockWorkbook.Setup(wb => wb.Worksheets).Returns(new Sheets { mockWorksheet.Object });
            mockWorksheet.Setup(ws => ws.UsedRange).Returns(mockRange.Object);
            mockRange.Setup(r => r.Value2).Returns(new object[,] { { "HIPAA Protected Data" } });

            _mockClassificationEngine.Setup(ce => ce.ClassifyContent(It.IsAny<string>()))
                .Returns("HIPAA");

            _mockComplianceService.Setup(cs => cs.GetComplianceRules("HIPAA"))
                .Returns(new List<ComplianceRule>
                {
                    new ComplianceRule { Action = ComplianceAction.Encrypt },
                    new ComplianceRule { Action = ComplianceAction.RestrictAccess }
                });

            // Act: Call EnforceComplianceRules method
            var result = _dlpService.EnforceComplianceRules(mockWorkbook.Object);

            // Assert: Verify compliance rules are enforced correctly
            Assert.IsTrue(result.RulesEnforced);
            Assert.AreEqual(2, result.EnforcedActions.Count);
            Assert.IsTrue(result.EnforcedActions.Contains(ComplianceAction.Encrypt));
            Assert.IsTrue(result.EnforcedActions.Contains(ComplianceAction.RestrictAccess));
            mockRange.Verify(r => r.Cells.Encrypt(), Times.Once);
            mockWorkbook.Verify(wb => wb.Permission.RestrictAccess(), Times.Once);
        }
    }
}