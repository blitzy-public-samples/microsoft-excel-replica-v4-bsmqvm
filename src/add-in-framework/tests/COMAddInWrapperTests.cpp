#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../com/COMAddInWrapper.h"
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../interfaces/IExcelInterop.h"
#include <windows.h>
#include <ole2.h>

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

// Mock classes
class MockCOMAddIn : public IDispatch {
public:
    MOCK_METHOD(HRESULT, QueryInterface, (REFIID riid, void** ppvObject), (Stdcall, Override));
    MOCK_METHOD(ULONG, AddRef, (), (Stdcall, Override));
    MOCK_METHOD(ULONG, Release, (), (Stdcall, Override));
    MOCK_METHOD(HRESULT, GetTypeInfoCount, (UINT* pctinfo), (Stdcall, Override));
    MOCK_METHOD(HRESULT, GetTypeInfo, (UINT iTInfo, LCID lcid, ITypeInfo** ppTInfo), (Stdcall, Override));
    MOCK_METHOD(HRESULT, GetIDsOfNames, (REFIID riid, LPOLESTR* rgszNames, UINT cNames, LCID lcid, DISPID* rgDispId), (Stdcall, Override));
    MOCK_METHOD(HRESULT, Invoke, (DISPID dispIdMember, REFIID riid, LCID lcid, WORD wFlags, DISPPARAMS* pDispParams, VARIANT* pVarResult, EXCEPINFO* pExcepInfo, UINT* puArgErr), (Stdcall, Override));
};

class MockAddInHost : public IAddInHost {
public:
    MOCK_METHOD(void, Initialize, (IExcelInterop* excelInterop), (Override));
    MOCK_METHOD(void, Shutdown, (), (Override));
};

class MockExcelInterop : public IExcelInterop {
public:
    MOCK_METHOD(void, CalculateCell, (const std::string& cellReference), (Override));
    MOCK_METHOD(void, SetCellValue, (const std::string& cellReference, const std::string& value), (Override));
    MOCK_METHOD(std::string, GetCellValue, (const std::string& cellReference), (Override));
};

class COMAddInWrapperTest : public ::testing::Test {
protected:
    void SetUp() override {
        mockCOMAddIn = new NiceMock<MockCOMAddIn>();
        mockAddInHost = std::make_shared<NiceMock<MockAddInHost>>();
        mockExcelInterop = std::make_shared<NiceMock<MockExcelInterop>>();
        comAddInWrapper = std::make_unique<COMAddInWrapper>(mockCOMAddIn);
    }

    void TearDown() override {
        mockCOMAddIn->Release();
    }

    MockCOMAddIn* mockCOMAddIn;
    std::shared_ptr<MockAddInHost> mockAddInHost;
    std::shared_ptr<MockExcelInterop> mockExcelInterop;
    std::unique_ptr<COMAddInWrapper> comAddInWrapper;
};

TEST_F(COMAddInWrapperTest, Constructor) {
    EXPECT_NE(comAddInWrapper, nullptr);
}

TEST_F(COMAddInWrapperTest, Initialize) {
    EXPECT_CALL(*mockAddInHost, Initialize(mockExcelInterop.get()));
    EXPECT_CALL(*mockCOMAddIn, Invoke(_, _, _, _, _, _, _, _))
        .WillOnce(Return(S_OK));

    comAddInWrapper->Initialize(mockAddInHost.get(), mockExcelInterop.get());
}

TEST_F(COMAddInWrapperTest, Shutdown) {
    EXPECT_CALL(*mockCOMAddIn, Invoke(_, _, _, _, _, _, _, _))
        .WillOnce(Return(S_OK));

    comAddInWrapper->Shutdown();
}

TEST_F(COMAddInWrapperTest, GetName) {
    EXPECT_CALL(*mockCOMAddIn, Invoke(_, _, _, _, _, _, _, _))
        .WillOnce(Return(S_OK));

    std::string name = comAddInWrapper->GetName();
    EXPECT_FALSE(name.empty());
}

TEST_F(COMAddInWrapperTest, GetVersion) {
    EXPECT_CALL(*mockCOMAddIn, Invoke(_, _, _, _, _, _, _, _))
        .WillOnce(Return(S_OK));

    std::string version = comAddInWrapper->GetVersion();
    EXPECT_FALSE(version.empty());
}

TEST_F(COMAddInWrapperTest, OnCalculate) {
    EXPECT_CALL(*mockCOMAddIn, Invoke(_, _, _, _, _, _, _, _))
        .WillOnce(Return(S_OK));

    comAddInWrapper->OnCalculate();
}

TEST_F(COMAddInWrapperTest, OnCommand) {
    EXPECT_CALL(*mockCOMAddIn, Invoke(_, _, _, _, _, _, _, _))
        .WillOnce(Return(S_OK));

    comAddInWrapper->OnCommand("TestCommand");
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}